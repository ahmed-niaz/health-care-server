import { Request, Response } from "express";
import { testService } from "./test.service";

const testCreateUser = async (req: Request, res: Response) => {
  const result = await testService.testCreateAdmin(req.body);
  res.send(result);
};

export const testController = {
  testCreateUser,
};
