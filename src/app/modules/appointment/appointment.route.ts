import express from "express";
import { appointmentController } from "./appointment.controller";
import { UserRole } from "../../../generated/prisma";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.patient),
  appointmentController.createAppointment
);

export const appointmentRoutes = router;
