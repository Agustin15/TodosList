import { SubscriptionPushService } from "../services/subscriptionPushService.js";
import { authRequest } from "../auth/auth.js";

export const addSubscriptionUser = async (req, res) => {
  try {
    const validAuthenticacion = await authRequest(req, res);
    if (!req.body.subscription) {
      throw new Error("subscription undefined");
    }
    
    const subscription = req.body.subscription;

    const subscriptionAdded = await SubscriptionPushService.addSubscriptionUser(
      subscription,
      validAuthenticacion.idUser
    );

    res.status(201).json(subscriptionAdded);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    await authRequest(req, res);
    let paramDelete = JSON.parse(req.params.paramDelete);
    if (!paramDelete.endpoint)
      throw new Error("endpoint subscription undefined");

    let endpoint = decodeURIComponent(paramDelete.endpoint);

    const deletedSubscription =
      await SubscriptionPushService.deleteSubscription(endpoint);

    res.status(200).json(deletedSubscription);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
