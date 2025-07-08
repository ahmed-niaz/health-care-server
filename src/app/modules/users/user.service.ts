// ! [perform different query]

import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from "../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from "../../../helpers/prisma";
import { fileUploader } from "../../../helpers/file.uploader";
import { IFile } from "../../interfaces/file";
import { userSearchableFields } from "./user.constant";
import { Request } from "express";
import status from "http-status";
import { IAuthUser } from "./user.interface";

const createAdmin = async (req: Request): Promise<Admin> => {
  // console.log("File", req.file);
  // console.log("Data", req.body.data);

  const file = req.file as IFile;
  console.log(req.body);

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    (req.body.admin.profilePhoto = uploadToCloudinary?.secure_url),
      // console.log("upload data to the cloudinary", uploadToCloudinary);
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

// todo: create doctor
const createDoctor = async (req: Request): Promise<Doctor> => {
  const file = req.file as IFile;
  // console.log(req.body);

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    (req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url),
      // console.log("upload data to the cloudinary", uploadToCloudinary);
      console.log(req.body);
  }

  // todo:  password hashing
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  // console.log({ hashedPassword });

  //   console.log(data.admin);
  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.doctor,
  };

  //   console.log({ userData });

  // todo: though simultaneously update admin & user data so here i using transaction

  const result = await prisma.$transaction(async (userTransaction) => {
    // create user data
    await userTransaction.user.create({
      data: userData,
    });

    // create admin data
    return await userTransaction.doctor.create({ data: req.body.doctor });
  });

  return result;
};

// todo: create patient
const createPatient = async (req: Request): Promise<Patient> => {
  // console.log("File", req.file);
  // console.log("Data", req.body);

  const file = req.file as IFile;
  // console.log(req.body);

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    (req.body.patient.profilePhoto = uploadToCloudinary?.secure_url),
      // console.log("upload data to the cloudinary", uploadToCloudinary);
      console.log(req.body);
  }

  // todo:  password hashing
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  console.log({ hashedPassword });

  //   console.log(data.admin);
  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.patient,
  };

  //   console.log({ userData });

  // todo: though simultaneously update admin & user data so here i using transaction

  const result = await prisma.$transaction(async (userTransaction) => {
    // create user data
    await userTransaction.user.create({
      data: userData,
    });

    // create admin data
    return await userTransaction.patient.create({ data: req.body.patient });
  });

  return result;
};

//! todo: get all users
const getUsers = async (params: any, options: any) => {
  const { searchTerm, ...filterData } = params;
  // console.log({ filterData });
  const { page, limit, sortBy, sortOrder } = options;
  // todo-1: conditions
  const andConditions: Prisma.UserWhereInput[] = [];

  // todo-2: push data to the array if searchTerm [condition] available
  if (searchTerm) {
    andConditions.push({
      //! array & using loop [map: because map return an array]
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // todo-4: Apply filter logic on specific fields based on provided filterData
  //  ** we know we can create an array form an object.
  // console.log("object to an array", Object.keys(filterData).length);

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((field) => ({
        [field]: {
          // ! exact match
          equals: filterData[field],
        },
      })),
    });
  }

  // todo-3: create an object
  const whereAsObject: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  // const whereAsObject: Prisma.UserWhereInput = { AND: andConditions };

  // todo: assign default value
  const pages = page || 1;
  const limits = limit || 2;

  const result = await prisma.user.findMany({
    where: whereAsObject,
    skip: (Number(pages) - 1) * limits,
    take: Number(limits),
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({
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

//! change profile status
const changeProfileStatus = async (status: UserRole, id: string) => {
  // console.log("update profile status", data, id);

  //! find the existing user
  await prisma.user.findUnique({
    where: {
      id,
    },
  });

  // console.log(userData);

  // todo: change user status
  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

// ! get profile information
const myProfile = async (user: IAuthUser) => {
  // console.log(user);
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;

  if (userInfo?.role === UserRole.super_admin) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo?.role === UserRole.admin) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo?.role === UserRole.doctor) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo?.role === UserRole.patient) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

// todo: update profile data

const updateProfileData = async (user: IAuthUser, req: Request) => {
  // console.log({ user });
  // console.log({ req });

  // todo-1 : user exist or not
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user?.email,
      status: UserStatus.active,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  if (!userInfo) {
    throw new Error("No active user found with this email.");
  }

  // todo: upload file to the cloudinary
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;

  if (userInfo?.role === UserRole.super_admin) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo?.role === UserRole.admin) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo?.role === UserRole.doctor) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo?.role === UserRole.patient) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }

  return { ...profileInfo };
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getUsers,
  changeProfileStatus,
  myProfile,
  updateProfileData,
};
