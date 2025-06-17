import prisma from "../../../helpers/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userLogin = async (payload: { email: string; password: string }) => {
  // console.log("user is logged in 🫤", payload);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password is incorrect ⚠️");
  }

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

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const authService = { userLogin };
