import { Prisma } from "../../../generated/prisma";
import { calculateDoctorSchedulePagination } from "../../../helpers/paginationHelpers";
import prisma from "../../../helpers/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IAuthUser } from "../users/user.interface";

const insertDoctorSchedule = async (
  user: any,
  payload: {
    scheduleId: string[];
  }
) => {
  // todo: doctor or user data
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!doctorData) {
    throw new Error("doctor data is not available");
  }

  // todo: insert multiple data at once.
  const doctorScheduleData = payload.scheduleId.map((id) => ({
    doctorId: doctorData.id,
    scheduleId: id,
  }));

  // todo: create doctor schedule
  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const getDoctorSchedule = async (
  params: any,
  options: IPaginationOptions,
  user: IAuthUser
) => {
  const { endTime, startTime, ...filters } = params;
  const { sortBy, sortOrder, limit, page, skip } =
    calculateDoctorSchedulePagination(options);

  const andConditions: any = [];

  // todo: get startDate & endDate
  if (startTime && endTime) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startTimeDate: {
              gte: startTime,
            },
          },
        },
        {
          schedule: {
            endTimeDate: {
              lte: endTime,
            },
          },
        },
      ],
    });
  }

  // todo: find doctor data
  const doctorData = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  if (!doctorData) {
    throw new Error("doctor data is not available");
  }

  // todo: search for specific filters
  if (Object.keys(filters).length > 0) {
    // todo: convert isBooked boolean data to string
    if (typeof filters.isBooked === "string" && filters.isBooked === "true") {
      filters.isBooked = true;
    } else if (
      typeof filters.isBooked === "string" &&
      filters.isBooked === "false"
    ) {
      filters.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(filters).map((value) => ({
        [value]: {
          equals: (filters as any)[value],
        },
      })),
    });
  }

  // todo: input the object
  const whereAsObject: Prisma.DoctorSchedulesWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.doctorSchedules.findMany({
    where: whereAsObject,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : {},
  });

  const total = await prisma.doctorSchedules.count({
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

const deleteDoctorSchedule = async (user: IAuthUser, scheduleId: string) => {
  console.log(scheduleId);
  // todo: find doctor information
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!doctorData) {
    throw new Error("Doctor data is not found not found");
  }

  const scheduleIsBooked = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData?.id,
      scheduleId: scheduleId,
      isBooked: true,
    },
  });

  if (scheduleIsBooked) {
    throw new Error("schedule is already booked");
  }
  // todo: delete composite key
  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData?.id,
        scheduleId: scheduleId,
      },
    },
  });

  return result;
};

export const doctorScheduleService = {
  insertDoctorSchedule,
  getDoctorSchedule,
  deleteDoctorSchedule,
};
