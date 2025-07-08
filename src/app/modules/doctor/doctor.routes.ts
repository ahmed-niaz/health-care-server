import express from "express";
import { doctorController } from "./doctor.controller";

const router = express.Router();

router.get("/", doctorController.getDoctor);
router.patch("/:id", doctorController.updateDoctor);

export const doctorRoutes = router;
