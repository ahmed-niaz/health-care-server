// ! [perform different query]

import { UserRole } from "../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from "../../../helpers/prisma";
import { fileUploader } from "../../../helpers/file.uploader";

const createAdmin = async (req: any) => {
  // console.log("File", req.file);
  // console.log("Data", req.body.data);

  const file = req.file;
  console.log(req.body);

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    (req.body.admin.profilePhoto = uploadToCloudinary?.secure_url),
      console.log("upload data to the cloudinary", uploadToCloudinary);
    console.log(req.body);
  }

  // todo:  password hashing
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  console.log({ hashedPassword });

  //   console.log(data.admin);
  const userData = {
    email: req.body.admin.email,
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
    return await userTransaction.admin.create({ data: req.body.admin });
  });

  return result;
};

export const userService = {
  createAdmin,
};
