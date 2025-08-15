import express from "express";
import { patientController } from "./patient.controller";

const router = express.Router();

router.get("/", patientController.getPatient);

export const patientRoutes = router;
