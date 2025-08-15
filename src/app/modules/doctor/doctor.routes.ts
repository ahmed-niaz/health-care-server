import express from "express";
import { doctorController } from "./doctor.controller";

const router = express.Router();

router.get("/", doctorController.getDoctor);
router.get("/:id", doctorController.getSingleDoctor);
router.delete("/:id", doctorController.deleteDoctor);

router.patch("/:id", doctorController.updateDoctor);
router.delete("/soft/:id", doctorController.softDeleteDoctor);

export const doctorRoutes = router;
