import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { doctorScheduleService } from "./doctorSchedule.service";
import { User } from "../../../generated/prisma";
import { Request, Response } from "express";
import { pick } from "../../../shared/pick";
import {
  filterableDoctorScheduleFields,
  optionsDoctorScheduleFields,
} from "./doctorSchedule.constant";
import { IAuthUser } from "../users/user.interface";

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

const getDoctorSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, filterableDoctorScheduleFields);
    const options = pick(req.query, optionsDoctorScheduleFields);

    const user = req.user as IAuthUser;

    const result = await doctorScheduleService.getDoctorSchedule(
      filters,
      options,
      user
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "doctor schedule data retrieve successfully 🗓️",
      data: result,
    });
  }
);

const deleteDoctorSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const { id } = req.params;
    console.log("from controller", id);
    const result = await doctorScheduleService.deleteDoctorSchedule(
      user as IAuthUser,
      id
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "doctor schedule data deleted successfully 🗓️",
      data: result,
    });
  }
);

export const doctorScheduleController = {
  insertDoctorSchedule,
  getDoctorSchedule,
  deleteDoctorSchedule,
};
