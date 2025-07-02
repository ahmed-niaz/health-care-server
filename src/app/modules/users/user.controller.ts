// ! [The controller will handle the request and response]

import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { userFilterableFields, userOptionalFields } from "./user.constant";

//! create admin
const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdmin(req);
    res.status(200).json({
      success: true,
      message: "admin created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
      error: err,
    });
  }
};

//! create doctor
const createDoctor = async (req: Request, res: Response) => {
  try {
    const result = await userService.createDoctor(req);
    res.status(200).json({
      success: true,
      message: "doctor created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
      error: err,
    });
  }
};

//! create patient
const createPatient = async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "patient created successfully",
    data: result,
  });
};

// todo - 5: pick fn for filtering
const pick2 = <T extends Record<string, unknown>, k extends keyof T>(
  object: T,
  keys: k[]
) => {
  // console.log({ object });

  const sendObjectFilters: Partial<T> = {};

  for (const key of keys) {
    if (object && Object.hasOwnProperty.call(object, key)) {
      sendObjectFilters[key] = object[key];
    }
  }

  return sendObjectFilters;
};

//! get all users data
const getUsers = catchAsync(async (req, res) => {
  const filters = pick2(req.query, userFilterableFields);
  // console.log({ filters });
  const options = pick2(req.query, userOptionalFields);
  // console.log({ options });
  const result = await userService.getUsers(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// ! change profile status
const changeProfileStatus = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const result = await userService.changeProfileStatus(data, id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "profile status is changed 💥",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getUsers,
  changeProfileStatus,
};
