import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { authService } from "./auth.service";
import { Request, Response } from "express";

const userLogin = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.userLogin(payload);

  // todo: set refreshToken into the cookie
  res.cookie("refreshToken", result.refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "authorization/logged in successful 🙀",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const payload = req.cookies.refreshToken;
  console.log({ payload });
  const result = await authService.refreshToken(payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "authorization/logged in successful 🙀",
    data: result,
    // data: {
    //   accessToken: result.accessToken,
    //   needPasswordChange: result.needPasswordChange,
    // },
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const payload = req.body;
    const user = req.user;
    // console.log({ verifiedUser });
    const result = await authService.changePassword(payload, user);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "password is changed 🙀",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  await authService.forgotPassword(payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "check you email 🙀",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  const payload = req.body;
  await authService.resetPassword(token, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "password reset 🙀",
    data: null,
  });
});

export const authController = {
  userLogin,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
