import express from "express";
import {
  addSubscriptionUser,
  deleteSubscription,
  getSubscriptionByUser
} from "../controllers/subscriptionPushController.js";
export const subscriptionRoutes = express.Router();

subscriptionRoutes.post("/", addSubscriptionUser);
subscriptionRoutes.get("/", getSubscriptionByUser);
subscriptionRoutes.delete("/:paramDelete", deleteSubscription);
