// ! [perform different query]

import { UserRole } from "../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from "../../../helpers/prisma";

const createAdmin = async (data: any) => {
  // password hashing
  const hashedPassword: string = await bcrypt.hash(data.password, 12);
  console.log({ hashedPassword });

  //   console.log(data.admin);
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.admin,
  };

  //   console.log({ userData });

  // todo: though simultaneously update admin & user data so here i using transaction

  const result = await prisma.$transaction(async (userTransaction) => {
    // create user data
    await userTransaction.user.create({
      data: userData,
    });

    // create admin data
    return await userTransaction.admin.create({ data: data.admin });
  });

  return result;
};

export const userService = {
  createAdmin,
};
