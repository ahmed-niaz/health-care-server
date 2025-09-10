import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { doctorScheduleService } from "./doctorSchedule.service";
import { User } from "../../../generated/prisma";

const insertDoctorSchedule = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user as User;
  const result = await doctorScheduleService.insertDoctorSchedule(
    user,
    payload
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "doctor schedule data insert successfully 🗓️",
    data: result,
  });
});

export const doctorScheduleController = {
  insertDoctorSchedule,
};
