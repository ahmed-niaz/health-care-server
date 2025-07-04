import { z } from "zod";
import { Gender, UserStatus } from "../../../generated/prisma";

// todo: admin validation schema
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

// todo: doctor validation schema
const createDoctorValidationSchema = z.object({
  password: z.string({
    required_error: "password is required",
  }),
  doctor: z.object({
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
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "registration number is required",
    }),
    experience: z.number().optional(),
    gender: z.enum([Gender.male, Gender.female]),
    appointmentFee: z.number({
      required_error: "appointmentFee is required",
    }),
    qualification: z.string({
      required_error: "qualification is required",
    }),
    currentWorkingPlace: z.string({
      required_error: "current working palace is required",
    }),
    designation: z.string({
      required_error: "designation is required",
    }),
    averageRating: z.number().optional(),
  }),
});

const createPatientValidationSchema = z.object({
  password: z.string({
    required_error: "password is required",
  }),
  patient: z.object({
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
    address: z.string().optional(),
  }),
});

const updateUserStatusValidationSchema = z.object({
  body: z
    .object({
      status: z.enum([
        UserStatus.active,
        UserStatus.blocked,
        UserStatus.deleted,
      ]),
    })
    .strict(),
});

export const userValidation = {
  createAdminValidationSchema,
  createDoctorValidationSchema,
  createPatientValidationSchema,
  updateUserStatusValidationSchema,
};
