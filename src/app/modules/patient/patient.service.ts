import { Prisma } from "../../../generated/prisma";
import { calculatePagination } from "../../../helpers/paginationHelpers";
import prisma from "../../../helpers/prisma";
import { searchablePatientFields } from "./patient.constant";

const getDoctor = async (params: any, options: any) => {
  const { searchTerm, ...filters } = params;
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchablePatientFields.map((value) => ({
        [value]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //   console.log(filters);
  //   console.log(Object.keys(filters));

  //   todo: search specific area
  if (Object.keys(filters).length > 0) {
    andConditions.push({
      AND: Object.keys(filters).map((value) => ({
        [value]: {
          equals: (filters as any)[value],
        },
      })),
    });
  }

  const result = await prisma.patient.findMany({
    where: { AND: andConditions },
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
  });

  // todo: count total patient data
  const total = await prisma.patient.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const patientService = {
  getDoctor,
};
