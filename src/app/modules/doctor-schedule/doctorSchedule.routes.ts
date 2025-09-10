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

export const doctorScheduleRoutes = router;
