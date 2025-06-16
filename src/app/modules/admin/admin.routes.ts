import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controller";
import { AnyZodObject, z } from "zod";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidation } from "./admin.validation";

const router = express.Router();

router.get("/", adminController.getAdmin);
router.get("/:id", adminController.getSingleAdmin);
router.patch(
  "/:id",
  validateRequest(adminValidation.updateAdminValidationSchema),
  adminController.updateAdmin
);
router.delete("/:id", adminController.deleteAdmin);
router.delete("/soft/:id", adminController.softDeleteAdmin);

export const adminRoutes = router;
