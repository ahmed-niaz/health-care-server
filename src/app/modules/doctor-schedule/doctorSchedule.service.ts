import prisma from "../../../helpers/prisma";

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

export const doctorScheduleService = {
  insertDoctorSchedule,
};
