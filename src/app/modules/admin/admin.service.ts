import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

const getAdmin = async () => {
  return await prisma.admin.findMany();
};

export const adminService = { getAdmin };
