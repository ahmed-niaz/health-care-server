import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidation } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.admin, UserRole.super_admin),
  adminController.getAdmin
);
router.get("/:id", adminController.getSingleAdmin);
router.patch(
  "/:id",
  auth(UserRole.admin, UserRole.super_admin),
  validateRequest(adminValidation.updateAdminValidationSchema),
  adminController.updateAdmin
);
router.delete(
  "/:id",
  auth(UserRole.admin, UserRole.super_admin),
  adminController.deleteAdmin
);
router.delete(
  "/soft/:id",
  auth(UserRole.admin, UserRole.super_admin),
  adminController.softDeleteAdmin
);

export const adminRoutes = router;
