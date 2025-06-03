import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAdmin = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAdmin();
    res.status(200).json({
      success: true,
      message: "admin data retrieve successfully",
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

export const adminController = { getAdmin };
