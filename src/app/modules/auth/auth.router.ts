import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post("/login", authController.userLogin);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/change-password",
  auth(UserRole.super_admin, UserRole.admin, UserRole.doctor, UserRole.patient),
  authController.changePassword
);

export const authRoutes = router;
