import { z } from "zod";

const createAdminValidationSchema = z.object({
  password: z.string({
    required_error: "password is required",
  }),
  admin: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z
      .string({
        required_error: "email is required",
      })
      .email(),
    contactNumber: z.string({
      required_error: "contact number is required",
    }),
  }),
});

export const userValidation = {
  createAdminValidationSchema,
};
