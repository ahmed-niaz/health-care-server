import { add, addDays, addHours, addMinutes, parse } from "date-fns";
import prisma from "../../../helpers/prisma";
import { format } from "./../../../../node_modules/date-fns/format";
import { Prisma, Schedule } from "../../../generated/prisma";
import { IFilterableSchedule, ISchedule } from "./schedule.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelpers";
import { IAuthUser } from "../users/user.interface";

const createSchedules = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startTimeDate, endTimeDate, startTime, endTime } = payload;
  const intervalTime = 30;
  const schedules = [];
  // const currentDate = parse(startTimeDate, "dd-MM-yyyy", new Date());
  // const endDate = parse(endTimeDate, "dd-MM-yyyy", new Date());

  let currentDate = new Date(startTimeDate);
  let endDate = new Date(endTimeDate);

  // console.log({ currentDate, endDate });

  while (currentDate <= endDate) {
    let startSlot = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    // console.log(startHour);  2025-08-22T09:00:00.000Z

    let endSlot = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    // console.log({ endHour });2025-08-22T09:00:00.000Z

    // todo: create slot
    while (startSlot < endSlot) {
      const scheduleData = {
        startTimeDate: startSlot,
        endTimeDate: addMinutes(startSlot, intervalTime),
      };

      const existingSlot = await prisma.schedule.findFirst({
        where: {
          startTimeDate: scheduleData.startTimeDate,
          endTimeDate: scheduleData.endTimeDate,
        },
      });

      if (!existingSlot) {
        // todo: create schedule
        const result = await prisma.schedule.create({
          data: scheduleData,
        });

        schedules.push(result);
      } else {
        throw new Error("⚠️ The schedule already exists");
      }

      // startHour.setMinutes(startHour.getMinutes() + intervalTime);
      startSlot = addMinutes(startSlot, intervalTime);
    }

    currentDate = addDays(currentDate, 1);
  }

  return schedules;
};

const getSchedules = async (
  params: IFilterableSchedule,
  options: IPaginationOptions,
  user: IAuthUser
) => {
  const { startTime, endTime, ...filters } = params;
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  console.log(startTime, endTime);

  const andConditions = [];

  if (startTime && endTime) {
    andConditions.push({
      AND: {
        startTimeDate: {
          gte: startTime,
        },
        endTimeDate: {
          lte: endTime,
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

  // todo: input the object
  const whereAsObject: Prisma.ScheduleWhereInput = { AND: andConditions };

  const doctorSchedule = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  // todo: find doctor scheduleId
  const doctorSchedulesId = doctorSchedule.map(
    (schedule) => schedule.scheduleId
  );

  const result = await prisma.schedule.findMany({
    where: {
      ...whereAsObject,
      id: {
        notIn: doctorSchedulesId,
      },
    },
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

  const total = await prisma.schedule.count({
    where: {
      ...whereAsObject,
      id: {
        notIn: doctorSchedulesId,
      },
    },
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

export const scheduleService = {
  getSchedules,
  createSchedules,
};
