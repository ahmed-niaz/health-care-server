import { Doctor, Prisma, UserStatus } from "../../../generated/prisma";
import { calculatePagination } from "../../../helpers/paginationHelpers";
import prisma from "../../../helpers/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { searchableDoctorFields } from "./doctor.constant";
import { IDoctorFilterRequest } from "./doctor.interface";

const getDoctor = async (
  params: IDoctorFilterRequest,
  options: IPaginationOptions
) => {
  const { searchTerm, specialties, ...filters } = params;

  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchableDoctorFields.map((value) => ({
        [value]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
            },
          },
        },
      },
    });
  }

  // todo: search specific filters
  if (Object.keys(filters).length > 0) {
    andConditions.push({
      AND: Object.keys(filters).map((value) => ({
        [value]: {
          equals: (filters as any)[value],
        },
      })),
    });
  }

  // console.dir(andConditions, { depth: "infinity" });

  // todo: input the object
  const whereAsObject: Prisma.DoctorWhereInput = { AND: andConditions };

  const result = await prisma.doctor.findMany({
    where: whereAsObject,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereAsObject,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleDoctor = async (id: any) => {
  const doctorData = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!doctorData) {
    throw new Error("doctor id is not available 🔻");
  }

  return doctorData;
};

const updateDoctor = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;
  // console.log({ specialties, doctorData });

  const doctorInformation = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!doctorInformation) {
    throw new Error("doctor data is not available");
  }

  // todo: update data for doctor and create data for the doctorSpecialties
  await prisma.$transaction(async (transactionClient) => {
    // todo: update doctor data
    await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: true,
      },
    });

    // todo: delete some specialties & update / add some specialties.

    if (specialties && specialties.length > 0) {
      const deletedSpecialtiesIds = specialties.filter(
        (s_id: any) => s_id.isDeleted
      );

      // todo: delete doctorSpecialties Model Data
      for (const s_id of deletedSpecialtiesIds) {
        // const deletedDoctorSpecialties =
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInformation.id,
            specialtiesId: s_id.specialtiesId,
          },
        });
      }

      // console.log({ deletedSpecialtiesIds });
      // todo: create doctorSpecialties Model Data
      const existedSpecialtiesIds = specialties.filter(
        (s_id: any) => !s_id.isDeleted
      );
      // console.log({ existedSpecialtiesIds });

      for (const s_id of existedSpecialtiesIds) {
        // const existedDoctorSpecialties =
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInformation.id,
            specialtiesId: s_id.specialtiesId,
          },
        });
      }
    }
  });

  // todo: we need to find the data again
  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInformation.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return result;
};

// todo: delete doctor data
const deleteDoctor = async (id: string): Promise<Doctor> => {
  const doctorData = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  // console.log({ doctorData });

  if (!doctorData) {
    throw new Error("doctor data is not available 😰");
  }

  // todo: delete doctor data & also delete fk for the doctor data
  const result = await prisma.$transaction(async (doctorTransaction) => {
    // todo: delete doctor data from the doctorSpecialties Model also
    await doctorTransaction.doctorSpecialties.deleteMany({
      where: {
        doctorId: id,
      },
    });

    // todo: delete doctor data based on the ID
    const deleteDoctorData = await doctorTransaction.doctor.delete({
      where: {
        id,
      },
    });
    // todo: delete doctor data based on the User Model
    await doctorTransaction.user.delete({
      where: {
        email: deleteDoctorData.email,
      },
    });

    return deleteDoctorData;
  });
  return result;
};

// todo: soft delete doctor data
const softDeleteDoctor = async (id: string) => {
  const doctorData = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  // console.log({ doctorData });

  if (!doctorData) {
    throw new Error("doctor data is not available 😰");
  }

  const result = await prisma.$transaction(async (doctorTransaction) => {
    // todo: delete doctor Specialties data
    await doctorTransaction.doctorSpecialties.deleteMany({
      where: {
        doctorId: id,
      },
    });

    // todo: delete doctor data
    const deleteDoctorData = await doctorTransaction.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    // todo: delete doctor data from User
    await doctorTransaction.user.update({
      where: {
        email: deleteDoctorData.email,
      },
      data: {
        status: UserStatus.deleted,
      },
    });

    return deleteDoctorData;
  });

  return result;
};

export const doctorService = {
  getDoctor,
  getSingleDoctor,
  deleteDoctor,
  updateDoctor,
  softDeleteDoctor,
};
