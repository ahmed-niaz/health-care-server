// ! [The controller will handle the request and response]

import { Request, Response } from "express";
import { userService } from "./user.service";

// create admin
const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdmin(req.body);
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

// get admin
const getAdmin = async (req: Request, res: Response) => {};

export const userController = {
  createAdmin,
};
