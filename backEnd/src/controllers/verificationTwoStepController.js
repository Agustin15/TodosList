import { authRequest } from "../auth/auth.js";
import { VerificationTwoStepService } from "../services/verificationTwoStepService.js";

export const addVerificationTwoStep = async (req, res) => {
  try {
    const validAuth = await authRequest(req, res);

    if (!req.body) throw new Error("Body request null");

    if (!req.body.confirmPassword) throw new Error("confirmPassword undefined");

    let confirmPassword = req.body.confirmPassword;

    const verificationAdded =
      await VerificationTwoStepService.addVerificationTwoStep(
        validAuth.idUser,
        confirmPassword
      );

    res.status(201).json({ verificationAdded: verificationAdded });
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getVerificationTwoStepByUser = async (req, res) => {
  try {
    const validAuth = await authRequest(req, res);

    const verificationFound =
      await VerificationTwoStepService.findVerificationByUser(validAuth.idUser);

    res.status(200).json(verificationFound);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateStateVerificationByUser = async (req, res) => {
  try {
    if (!req.body) throw new Error("Body request null");

    if (req.body.newState == null) throw new Error("newState undefined");

    if (!req.body.confirmPassword) throw new Error("confirmPassword undefined");

    let confirmPassword = req.body.confirmPassword;
    let newState = req.body.newState;

    const validAuth = await authRequest(req, res);

    const verificationFound =
      await VerificationTwoStepService.changeStateVerificationTwoStep(
        validAuth.idUser,
        newState,
        confirmPassword
      );

    res.status(200).json(verificationFound);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
