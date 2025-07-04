import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { specialtiesService } from "./specialties.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.createSpecialties(req);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Successfully assigned the specialty to the doctor 🫤",
    data: result,
  });
});

// todo: get specialties
const getSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.getSpecialties();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Retrieve all specialties associated with the doctor. 🫤",
    data: result,
  });
});

// todo: delete specialties by ID
const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialtiesService.deleteSpecialties(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "delete specialty associated with the doctor. 🫤",
    data: result,
  });
});

export const specialtiesController = {
  createSpecialties,
  getSpecialties,
  deleteSpecialties,
};
