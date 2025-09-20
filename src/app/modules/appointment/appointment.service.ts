import prisma from "../../../helpers/prisma";
import { IAuthUser } from "../users/user.interface";
import { v4 as uuidv4 } from "uuid";

const createAppointment = async (user: IAuthUser, payload: any) => {
  // todo: patient data
  const patientData = await prisma.patient.findUnique({
    where: {
      email: user?.email,
    },
  });
  // console.log("patient", patientData?.id);

  if (!patientData) {
    throw new Error("Patient is not available");
  }

  //  todo: doctor data is exist
  const doctorData = await prisma.doctor.findUnique({
    where: {
      id: payload.doctorId,
    },
  });
  //   console.log(doctorData);

  if (!doctorData) {
    console.log("doctor data is not available");
  }

  //  todo: doctorSchedule data is available to appointment
  await prisma.doctorSchedules.findMany({
    where: {
      doctorId: doctorData?.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallerId = uuidv4();

  const result = await prisma.$transaction(async (txc) => {
    // todo: 1- appointmentData
    const appointmentData = await txc.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData?.id,
        scheduleId: payload.scheduleId,
        videoCallingId: videoCallerId,
      },
      // include: {
      //   patient: true,
      //   doctor: true,
      //   schedule: true,
      //   payment: {
      //     include:
      //   },
      // },
    });

    // todo: 2 update doctorScheduleData
    await txc.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData?.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    // todo: generate transactionId
    const patientName = patientData.name
      .trim()
      .split(/\s+/)
      .join("-")
      .toLowerCase();
    const transactionId = "patient-" + patientName + "-txd-" + uuidv4();
    // console.log(transactionId);

    // todo: 3 added payment information
    await txc.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData?.appointmentFee,
        transactionId,
      },
    });

    // return appointmentData;
    return await txc.appointment.findUnique({
      where: {
        id: appointmentData.id,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
        payment: true,
      },
    });
  });

  return result;
};

export const appointmentService = {
  createAppointment,
};
