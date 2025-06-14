import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { filterableAdminFields } from "./admin.constant";
import prisma from "../../../helpers/prisma";

const getAdmin = async (req: Request, res: Response) => {
  //   console.log("from the postman search or filter query", req.query);

  // todo -4: pagination

  try {
    const filters = pick(req.query, filterableAdminFields);
    // console.log({ filters });
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log({ options });
    const result = await adminService.getAdmin(filters, options);
    res.status(200).json({
      success: true,
      message: "admin data retrieve successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
      error: err,
    });
  }
};

const getSingleAdmin = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const result = await adminService.getSingleAdmin(req.params.id);
    res.status(200).json({
      success: true,
      message: "single admin data retrieve successfully",
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

const updateAdmin = async (req: Request, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
      error: err,
    });
  }
};

export const adminController = { getAdmin, getSingleAdmin, updateAdmin };
