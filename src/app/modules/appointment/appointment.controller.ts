import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { appointmentService } from "./appointment.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import { User } from "../../../generated/prisma";
import { IAuthUser } from "../users/user.interface";

const createAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as User;
    const payload = req.body;
    const result = await appointmentService.createAppointment(user, payload);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "appointment created successfully 😶‍🌫️",
      data: result,
    });
  }
);

export const appointmentController = {
  createAppointment,
};
