import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { filterableAdminFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  //   console.log("from the postman search or filter query", req.query);

  // todo -4: pagination

  try {
    const filters = pick(req.query, filterableAdminFields);
    // console.log({ filters });
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log({ options });
    const result = await adminService.getAdmin(filters, options);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "admin data retrieve successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    next(err);
  }
};

const getSingleAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.params.id);
  try {
    const result = await adminService.getSingleAdmin(req.params.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "single admin data retrieve successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const id = req.params.id;

  try {
    const result = await adminService.updateAdmin(id, payload);
    res.status(200).json({
      success: true,
      message: " admin data updated successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const result = await adminService.deleteAdmin(id);
    res.status(200).json({
      success: true,
      message: " admin data deleted successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const result = await adminService.softDeleteAdmin(id);
    res.status(200).json({
      success: true,
      message: " admin data deleted successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const adminController = {
  getAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
