import { NextFunction, Request, Response } from "express";
import status from "http-status";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
      message: "the path is not found 😒!",
    },
  });
};

export default notFound;
