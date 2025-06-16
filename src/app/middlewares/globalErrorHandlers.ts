import { NextFunction, Request, Response } from "express";
import status from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("error is found from the global error handler");

  res.status(status.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.name || "something went wrong",
    error: err,
  });
};

export default globalErrorHandler;
