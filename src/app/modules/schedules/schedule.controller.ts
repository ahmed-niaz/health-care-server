import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { scheduleService } from "./schedule.service";
import {
  filterableScheduleFields,
  optionsScheduleFields,
} from "./schedule.constant";
import { pick } from "../../../shared/pick";
import { IAuthUser } from "../users/user.interface";
import { Request, Response } from "express";

const createSchedules = catchAsync(async (req, res) => {
  const result = await scheduleService.createSchedules(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "schedule data insert successfully 🗓️",
    data: result,
  });
});

const getSchedules = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, filterableScheduleFields);
    const options = pick(req.query, optionsScheduleFields);
    const user = req.user as IAuthUser;
    const result = await scheduleService.getSchedules(filters, options, user);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "schedule data retrieve successfully 🗓️",
      data: result,
    });
  }
);

export const scheduleController = {
  getSchedules,
  createSchedules,
};
