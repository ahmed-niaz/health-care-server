import express from "express";
import { testController } from "./test.controller";

const router = express.Router();

router.post("/create-user", testController.testCreateUser);

export const testRoutes = router;
