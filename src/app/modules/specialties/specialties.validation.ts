import { z } from "zod";

const createSpecialtiesValidationSchema = z.object({
  title: z.string({
    required_error: "title is required",
  }),
});

export const specialtiesValidation = {
  createSpecialtiesValidationSchema,
};
