import express from "express";
import { addSubscriptionUser,deleteSubscription} from "../controllers/subscriptionPushController.js";
export const subscriptionRoutes = express.Router();

subscriptionRoutes.post("/",addSubscriptionUser);
subscriptionRoutes.delete("/:paramDelete",deleteSubscription);

