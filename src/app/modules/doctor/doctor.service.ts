import prisma from "../../../helpers/prisma";

const getDoctor = async () => {
  const result = await prisma.doctor.findMany();
  return result;
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

export const doctorService = {
  getDoctor,
  updateDoctor,
};
