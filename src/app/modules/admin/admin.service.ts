import { equal } from "assert";
import { Prisma, PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

const getAdmin = async (params: any) => {
  // ! search on the specific fields.

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];
  const adminSearchableFields = ["name", "email"];

  /*

  console.log({ params });
  console.log({ searchTerm });
  console.log({ filterData });

  const keys = Object.keys(filterData).length;
  console.log({ keys });


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

  // TODO: search optimization
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

  // TODO: // TODO: Apply search or filter logic on specific fields based on provided filterData

  if (Object.keys(filterData).length > 0) {
    // TODO: though it is an object so convert into an array

    andConditions.push({
      AND: Object.keys(filterData).map((field) => ({
        [field]: {
          //! exact match
          equals: filterData[field],
        },
      })),
    });
  }

  return await prisma.admin.findMany({
    where: whereAsObject,
  });
};

export const adminService = { getAdmin };
