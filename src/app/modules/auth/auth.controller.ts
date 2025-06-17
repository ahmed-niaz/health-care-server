import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { authService } from "./auth.service";

const userLogin = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.userLogin(payload);

  // todo: set refreshToken into the cookie
  res.cookie("refresh-token", result.refreshToken, {
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

export const authController = { userLogin };
