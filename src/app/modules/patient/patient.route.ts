import express from "express";
import { patientController } from "./patient.controller";

const router = express.Router();

router.get("/", patientController.getPatient);
router.get("/:id", patientController.getSinglePatient);
router.patch("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);
router.delete("/soft/:id", patientController.softDelete);

export const patientRoutes = router;
