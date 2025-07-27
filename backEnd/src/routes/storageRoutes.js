import express from "express";
import { getStorageFilesUsedByUser } from "../controllers/storageController.js";
export const storageRoutes = express.Router();

storageRoutes.get("/", getStorageFilesUsedByUser);
