import { Request } from "express";
import { fileUploader } from "../../../helpers/file.uploader";
import prisma from "../../../helpers/prisma";
import { IFile } from "../../interfaces/file";

// todo: create specialties
const createSpecialties = async (req: Request) => {
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }
  return await prisma.specialties.create({
    data: req.body,
  });
};

// todo: get all specialties
const getSpecialties = async () => {
  return await prisma.specialties.findMany();
};

// todo: delete specialties by ID
const deleteSpecialties = async (id: string) => {
  return await prisma.specialties.delete({
    where: {
      id,
    },
  });
};

export const specialtiesService = {
  createSpecialties,
  getSpecialties,
  deleteSpecialties,
};
