import { SubscriptionPushService } from "../services/subscriptionPushService.js";
import { authRequest } from "../auth/auth.js";

export const addSubscriptionUser = async (req, res) => {
  try {
    const validAuthenticacion = authRequest(req, res);
    if (!req.body.subscription) {
      throw new Error("subscription undefined", {
        cause: { code: 400 }
      });
    }

    const subscription = req.body.subscription;

    const subscriptionAdded = await SubscriptionPushService.addSubscriptionUser(
      subscription,
      validAuthenticacion.idUser
    );

    res.status(201).json(subscriptionAdded);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    authRequest(req, res);
    let paramDelete = JSON.parse(req.params.paramDelete);
    if (!paramDelete.endpoint)
      throw new Error("endpoint subscription undefined", {
        cause: { code: 400 }
      });

    let endpoint = decodeURIComponent(paramDelete.endpoint);

    const deletedSubscription =
      await SubscriptionPushService.deleteSubscription(endpoint);

    res.status(200).json(deletedSubscription);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getSubscriptionByUser = async (req, res) => {
  try {
    const validAuth = authRequest(req, res);

    const subscriptionsUser =
      await SubscriptionPushService.getSubscriptionsByIdUser(validAuth.idUser);

    res.status(200).json(subscriptionsUser);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
