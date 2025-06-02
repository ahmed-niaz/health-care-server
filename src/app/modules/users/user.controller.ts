// ! [The controller will handle the request and response]

import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req.body);
  res.send(result);
};

export const userController = {
  createAdmin,
};
