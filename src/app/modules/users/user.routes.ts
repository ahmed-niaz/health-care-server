import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { fileUploader } from "../../../helpers/file.uploader";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// todo: access all users data
router.get(
  "/",
  auth(UserRole.admin, UserRole.super_admin),
  userController.getUsers
);

// todo: get profile information
router.get(
  "/profile",
  auth(UserRole.admin, UserRole.super_admin, UserRole.doctor, UserRole.patient),
  userController.myProfile
);

// ! admin routes
router.post(
  "/create-admin",
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

// ! doctor routes
router.post(
  "/create-doctor",
  auth(UserRole.admin, UserRole.super_admin),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // todo: parse the data to the json format
      const parseData = JSON.parse(req.body.data);
      req.body = userValidation.createDoctorValidationSchema.parse(parseData);
      return userController.createDoctor(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// todo: anyone can create patient account [patient routes]
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // todo: parse the data to the json format
      const parseData = JSON.parse(req.body.data);
      // console.log("parse data", parseData);
      req.body = userValidation.createPatientValidationSchema.parse(parseData);
      return userController.createPatient(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// todo: change the ProfileStatus
router.patch(
  "/:id/status",
  auth(UserRole.admin, UserRole.super_admin),
  validateRequest(userValidation.updateUserStatusValidationSchema),
  userController.changeProfileStatus
);

// todo: update profile data
router.patch(
  "/update-profile",
  auth(UserRole.admin, UserRole.super_admin, UserRole.doctor, UserRole.patient),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // todo: parse the data to the json format
      req.body = JSON.parse(req.body.data);
      return userController.updateProfileData(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

export const userRoutes = router;
