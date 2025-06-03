import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAdmin = async (req: Request, res: Response) => {
  //   console.log("from the postman search or filter query", req.query);
  try {
    const result = await adminService.getAdmin(req.query);
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
