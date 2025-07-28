import express from "express";
import {
  getVerificationTwoStepByUser,
  addVerificationTwoStep,
  updateStateVerificationByUser
} from "../controllers/verificationTwoStepController.js";
export const verificationTwoStepRoutes = express.Router();

verificationTwoStepRoutes.get("/", getVerificationTwoStepByUser);
verificationTwoStepRoutes.post("/", addVerificationTwoStep);
verificationTwoStepRoutes.patch("/", updateStateVerificationByUser);
