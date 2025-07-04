import express, { NextFunction, Request, Response } from "express";
import { specialtiesController } from "./specialties.controller";
import { fileUploader } from "../../../helpers/file.uploader";
import { specialtiesValidation } from "./specialties.validation";

const router = express.Router();

router.get("/specialties", specialtiesController.getSpecialties);

router.post(
  "/",
  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialtiesValidation.createSpecialtiesValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return specialtiesController.createSpecialties(req, res, next);
  }
);

router.delete("/specialties/:id", specialtiesController.deleteSpecialties);

export const specialtiesRoutes = router;
