import prisma from "../../../helpers/prisma";
import * as bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../../helpers/jwt.helpers";
import { UserStatus } from "../../../generated/prisma";
import config from "../../../config";
import status from "http-status";
import apiError from "../../errors/api.error";
import emailSender from "./email.sender";

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

const forgotPassword = async (payload: { email: string }) => {
  console.log("forgot password", payload);

  // todo: check user is exist
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
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

  // todo: generate validation token
  const resetPasswordToken = generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.jwt_reset_token as string,
    config.jwt.refresh_token_expires_in as string
  );

  console.log({ resetPasswordToken });

  // todo: generate link
  const resetPasswordLink =
    config.reset_password_link +
    `?uid: ${userData.id}&token: ${resetPasswordToken}`;

  await emailSender(
    userData.email,
    `
    <div style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    
                    <tr>
                        <td align="center" style="padding: 40px 0 30px 0; background-color: #0056b3; color: #ffffff;">
                            <h1 style="font-size: 24px; margin: 0;">Password Reset Request</h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="font-size: 20px; margin: 0 0 20px 0; color: #333333;">Hello, [User Name]!</h2>
                            <p style="margin: 0 0 25px 0; color: #555555; font-size: 16px; line-height: 1.5;">
                                We received a request to reset the password associated with your account. Please click the button below to set a new password.
                            </p>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${resetPasswordLink}" target="_blank" style="display: inline-block; padding: 15px 35px; font-size: 18px; font-weight: bold; color: #ffffff; background-color: #28a745; text-decoration: none; border-radius: 5px;">
                                            Reset Your Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 25px 0 15px 0; color: #555555; font-size: 16px; line-height: 1.5;">
                                If you did not request a password reset, please ignore this email. This password reset link is only valid for the next <strong>60 minutes</strong>.
                            </p>
                            
                            <p style="margin: 0; color: #777777; font-size: 14px;">
                                If the button above doesn't work, copy and paste this link into your browser:
                                <br>
                                <a href="${resetPasswordLink}" target="_blank" style="color: #007bff; text-decoration: underline; word-break: break-all;">${resetPasswordLink}</a>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 30px; background-color: #eeeeee; text-align: center;">
                            <p style="margin: 0; font-size: 14px; color: #777777;">
                                &copy; 2025 [Your Company Name]. All rights reserved.<br>
                                [Your Company Address], Dhaka, Bangladesh<br>
                                Need help? Contact our <a href="mailto:info@health-care.com" style="color: #007bff;">Support Team</a>.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
    
    `
  );

  console.log({ resetPasswordLink });

  // todo: send reset password in the email
};

const resetPassword = async (
  token: string,
  payload: {
    uid: string;
    password: string;
  }
) => {
  console.log({ payload });
  console.log({ token });

  const userData = await prisma.user.findUnique({
    where: {
      id: payload.uid,
      status: UserStatus.active,
    },
  });

  // todo: the user is exist
  if (!userData) {
    throw new apiError(status.NOT_FOUND, "User with this id does not exist.");
  }

  // todo: check the user status is active
  if (userData.status !== UserStatus.active) {
    throw new apiError(status.UNAUTHORIZED, "The user is not found");
  }

  // todo: token validation
  const isValidToken = verifyToken(token, config.jwt.jwt_reset_token as string);

  if (!isValidToken) {
    throw new apiError(status.FORBIDDEN, "token is not valid 😒");
  }

  // console.log({ isValidToken });

  // todo:  password hashing
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  console.log("new password", payload.password);
  // console.log({ hashedPassword });

  // todo : update into database
  await prisma.user.update({
    where: {
      id: payload.uid,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const authService = {
  userLogin,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
