import { Prisma, PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

const getAdmin = async (params: any) => {
  //   console.log({ params });

  const andConditions: Prisma.AdminWhereInput[] = [];
  const adminSearchableFields = ["name", "email"];

  /*
[
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
*/

  if (params.searchTerm) {
    andConditions.push({
      // array & using loop [map: because map return an array]
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const whereAsObject: Prisma.AdminWhereInput = { AND: andConditions };

  // console.dir(andConditions, { depth: "infinity" });

  return await prisma.admin.findMany({
    where: whereAsObject,
  });
};

export const adminService = { getAdmin };
