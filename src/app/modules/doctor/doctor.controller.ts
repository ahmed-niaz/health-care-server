import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { doctorService } from "./doctor.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const getDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorService.getDoctor();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "doctor data retrieve successfully 🫤",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.updateDoctor(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "doctor data retrieve successfully 🫤",
    data: result,
  });
});

export const doctorController = {
  getDoctor,
  updateDoctor,
};
