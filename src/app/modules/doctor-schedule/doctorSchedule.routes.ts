import express from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import { UserRole } from "../../../generated/prisma";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.doctor),
  doctorScheduleController.insertDoctorSchedule
);

router.get(
  "/my-schedule",
  auth(UserRole.doctor),
  doctorScheduleController.getDoctorSchedule
);

router.delete(
  "/:id",
  auth(UserRole.doctor),
  doctorScheduleController.deleteDoctorSchedule
);

export const doctorScheduleRoutes = router;
