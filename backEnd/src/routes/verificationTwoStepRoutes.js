import express from "express";
import {
  getVerificationTwoStepByUserAndRol,
  addVerificationTwoStep,
  updateStateVerificationByUserAndRol
} from "../controllers/verificationTwoStepController.js";
export const verificationTwoStepRoutes = express.Router();

verificationTwoStepRoutes.get("/", getVerificationTwoStepByUserAndRol);
verificationTwoStepRoutes.post("/", addVerificationTwoStep);
verificationTwoStepRoutes.patch("/", updateStateVerificationByUserAndRol);
