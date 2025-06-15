import { Response } from "express";

interface Meta {
  page: number;
  limit: number;
  total: number;
}

const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: Meta;
    data: T | undefined | null;
  }
) => {
  res.status(jsonData.statusCode).json({
    success: jsonData.success,
    message: jsonData.message,
    meta: jsonData.meta || null || undefined,
    data: jsonData.data || null || undefined,
  });
};

export default sendResponse;
