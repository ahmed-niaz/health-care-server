import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { doctorService } from "./doctor.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import { filterableDoctorFields, optionsDoctorFields } from "./doctor.constant";
import { pick } from "../../../shared/pick";

const getDoctor = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, filterableDoctorFields);
  const options = pick(req.query, optionsDoctorFields);
  const result = await doctorService.getDoctor(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "doctor data retrieve successfully 🫤",
    data: result,
  });
});

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.getSingleDoctor(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "doctor data retrieve successfully 🫤",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.deleteDoctor(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "doctor data retrieve successfully 🫤",
    data: result,
  });
});

const softDeleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.softDeleteDoctor(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "doctor data deleted successfully 🫤",
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
  getSingleDoctor,
  deleteDoctor,
  softDeleteDoctor,
  updateDoctor,
};
