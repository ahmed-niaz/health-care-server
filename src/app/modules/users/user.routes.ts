import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { fileUploader } from "../../../helpers/file.uploader";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.admin, UserRole.super_admin),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // todo: parse the data to the json format
      const parseData = JSON.parse(req.body.data);
      req.body = userValidation.createAdminValidationSchema.parse(parseData);
      return userController.createAdmin(req, res);
    } catch (err) {
      next(err);
    }
  }
);

export const userRoutes = router;
