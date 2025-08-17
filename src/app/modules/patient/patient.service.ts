import { Patient, Prisma } from "../../../generated/prisma";
import { calculatePagination } from "../../../helpers/paginationHelpers";
import prisma from "../../../helpers/prisma";
import { searchablePatientFields } from "./patient.constant";
import { IPatientUpdate } from "./patient.interface";

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
    include: {
      medicalReport: true,
      patientHealthData: true,
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

const updatePatient = async (
  id: string,
  payload: Partial<IPatientUpdate>
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientInformation } = payload;
  // console.log({ patientHealthData, medicalReport });
  const patientData = await prisma.patient.findUnique({
    where: { id },
  });

  if (!patientData) {
    throw new Error("Patient data is not available ⚠️");
  }
  //  console.log(patientData.id);

  const result = await prisma.$transaction(async (transactionClient) => {
    // todo 1: update patient data
    const updatedPatientInformation = await transactionClient.patient.update({
      where: { id },
      data: patientInformation,
      include: {
        medicalReport: true,
        patientHealthData: true,
      },
    });

    // todo 2: update patientHealthData or create patientHealthData.

    if (patientHealthData) {
      // const healthData =
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: updatedPatientInformation.id,
        },
        update: patientHealthData,
        create: {
          ...patientHealthData,
          patientId: updatedPatientInformation.id,
        },
      });

      // console.log(healthData);
    }

    // todo 3:  create medical report.
    if (medicalReport) {
      // const medicalReportData =
      await transactionClient.medicalReport.create({
        data: {
          ...medicalReport,
          patientId: updatedPatientInformation.id,
        },
      });

      // console.log(medicalReport);
    }
  });

  const responseData = await prisma.patient.findUnique({
    where: { id: patientData.id },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });

  return responseData;
};

export const patientService = {
  getDoctor,
  updatePatient,
};
