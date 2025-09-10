import express from "express";
import { scheduleController } from "./schedule.controller";
import { UserRole } from "../../../generated/prisma";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.super_admin, UserRole.admin),
  scheduleController.createSchedules
);
router.get("/", auth(UserRole.doctor), scheduleController.getSchedules);

export const scheduleRoutes = router;
