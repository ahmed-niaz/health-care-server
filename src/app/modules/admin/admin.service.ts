import { Admin, Prisma, UserStatus } from "../../../generated/prisma";
import { adminSearchableFields } from "./admin.constant";
import { calculatePagination } from "../../../helpers/paginationHelpers";
import prisma from "../../../helpers/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAdmin = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  // ! search on the specific fields.

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

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

  // TODO: search optimization [partial search]
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
          equals: (filterData as any)[field],
        },
      })),
    });
  }

  // todo: filtering data based on status
  andConditions.push({
    isDeleted: false,
  });

  /*
  return await prisma.admin.findMany({
    where: whereAsObject,

    // todo: pagination
    skip: (Number(page) - 1) * limit,
    take: Number(limit),

    // todo: dynamically sorting [define by user]
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  */

  const result = await prisma.admin.findMany({
    where: whereAsObject,

    // todo: pagination
    skip,
    take: limit,

    // todo: dynamically sorting [define by user]
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.admin.count({
    where: whereAsObject,
  });

  // todo: adding meta data
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// ! get single admin
const getSingleAdmin = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  });
  return result;
};

// ! update admin data
const updateAdmin = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  // console.log({ payload });
  // console.log({ id });

  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteAdmin = async (id: string): Promise<Admin | null> => {
  // console.log({ id });
  // console.log("delete admin data");

  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // todo: delete admin data and also delete fk for the admin data [email]
  const result = await prisma.$transaction(async (adminTransaction) => {
    // ! delete admin data based on ID
    const deleteAdminData = await adminTransaction.admin.delete({
      where: {
        id,
      },
    });

    // ! delete user data based on admin fk as email.
    await adminTransaction.user.delete({
      where: {
        email: deleteAdminData.email,
      },
    });

    return deleteAdminData;
  });

  return result;
};

const softDeleteAdmin = async (id: string): Promise<Admin | null> => {
  // console.log({ id });
  // console.log("delete admin data");

  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  // todo: delete admin data and also delete fk for the admin data [email]
  const result = await prisma.$transaction(async (adminTransaction) => {
    // ! delete admin data based on ID
    const deleteAdminData = await adminTransaction.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    // ! delete user data based on admin fk as email.
    await adminTransaction.user.update({
      where: {
        email: deleteAdminData.email,
      },
      data: {
        status: UserStatus.deleted,
      },
    });

    return deleteAdminData;
  });

  return result;
};

export const adminService = {
  getAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
