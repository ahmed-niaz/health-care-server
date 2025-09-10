import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { patientService } from "./patient.service";
import { pick } from "../../../shared/pick";
import {
  filterablePatientFields,
  optionsPatientFields,
} from "./patient.constant";

const getPatient = catchAsync(async (req, res) => {
  const filters = pick(req.query, filterablePatientFields);
  const options = pick(req.query, optionsPatientFields);
  const result = await patientService.getPatient(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "patient data retrieve successful 🤒",
    data: result,
  });
});

const getSinglePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientService.getSinglePatient(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "patient data retrieve successful 🤒",
    data: result,
  });
});

const updatePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientService.updatePatient(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient Data updated successfully 🥳",
    data: result,
  });
});

const deletePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientService.deletePatient(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient Data deleted successfully 🥳",
    data: result,
  });
});

const softDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientService.softDelete(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient Data deleted successfully 🥳",
    data: result,
  });
});

export const patientController = {
  getPatient,
  getSinglePatient,
  updatePatient,
  deletePatient,
  softDelete,
};
