import { Prisma, PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

const getAdmin = async (params: any) => {
  //   console.log({ params });

  const andConditions: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const whereAsObject: Prisma.AdminWhereInput = { AND: andConditions };

  console.dir(andConditions, { depth: "infinity" });

  return await prisma.admin.findMany({
    where: whereAsObject,
  });
};

export const adminService = { getAdmin };
