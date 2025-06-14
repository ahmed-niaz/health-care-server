import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { filterableAdminFields } from "./admin.constant";

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
