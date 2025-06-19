import prisma from "../../../helpers/prisma";
import * as bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../../helpers/jwt.helpers";
import { UserStatus } from "../../../generated/prisma";
import config from "../../../config";
import status from "http-status";
import apiError from "../../errors/api.error";

const userLogin = async (payload: { email: string; password: string }) => {
  // console.log("user is logged in 🫤", payload);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.active,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new apiError(status.UNAUTHORIZED, "Password is incorrect ⚠️");
  }

  /*
  // todo: create or generate  token [accessToken keeps in local storage]
  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "health-care",
    {
      algorithm: "HS256",
      expiresIn: "1h",
    }
  );

  // console.log({ accessToken });

  // todo: refresh token [keeps in cookie & http only] generate accessToken
  const refreshToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "refresh-token",
    {
      algorithm: "HS256",
      expiresIn: "30d",
    }
  );

  */

  // ! keeps in local storage
  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_access_token as Secret,
    config.jwt.access_token_expires_in as string
  );

  // ! keeps in cookie
  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_refresh_token as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (payload: string) => {
  // console.log("refreshToken ...", payload);

  let decodedData;
  // todo: verify refresh token
  try {
    // decodedData = jwt.verify(payload, "refresh-token") as JwtPayload;
    decodedData = verifyToken(payload, config.jwt.jwt_refresh_token as string);
  } catch (err) {
    throw new Error("You are not authorized ⚠️");
  }
  // console.log({ decodedData });
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.active,
    },
  });

  // todo: generate accessToken
  const accessToken = generateToken(
    {
      email: isUserExists.email,
      role: isUserExists.role,
    },
    config.jwt.jwt_access_token as string,
    "1h"
  );

  return {
    accessToken,
    needPasswordChange: isUserExists.needPasswordChange,
  };
};

// ** update password
const changePassword = async (payload: any, user: any) => {
  console.log("change the password", payload);
  console.log("change the password", user);

  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });

  if (!userData) {
    throw new apiError(
      status.NOT_FOUND,
      "User with this email does not exist."
    );
  }

  // todo: check the user status is active
  if (userData.status !== UserStatus.active) {
    throw new apiError(status.UNAUTHORIZED, "The user is not found");
  }

  // todo: check the old password
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.old_password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new apiError(status.UNAUTHORIZED, "Password is incorrect ⚠️");
  }

  // todo:  password hashing
  const hashedPassword: string = await bcrypt.hash(payload.new_password, 12);
  console.log("new password", payload.new_password);
  console.log({ hashedPassword });

  // todo: update the password into the database
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "password changed successfully 💥",
  };
};

export const authService = { userLogin, refreshToken, changePassword };
