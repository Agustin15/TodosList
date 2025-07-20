import express from "express";
import multer from "multer";
import { sendQueryClient } from "../controllers/helpQueryClientController.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const helpQueryClientRoutes = express.Router();

helpQueryClientRoutes.post("/", upload.any(), sendQueryClient);
