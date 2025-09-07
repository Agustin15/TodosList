import { authRequest } from "../auth/auth.js";
import { VerificationTwoStepService } from "../services/verificationTwoStepService.js";

export const addVerificationTwoStep = async (req, res) => {
  try {
    const validAuth = await authRequest(req, res);

    if (!req.body)
      throw new Error("Body request null", {
        cause: { code: 400 }
      });

    if (!req.body.confirmPassword)
      throw new Error("confirmPassword undefined", {
        cause: { code: 400 }
      });

    let confirmPassword = req.body.confirmPassword;

    const verificationAdded =
      await VerificationTwoStepService.addVerificationTwoStep(
        validAuth.idUser,
        validAuth.idRol,
        confirmPassword
      );

    res.status(201).json({ verificationAdded: verificationAdded });
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};

export const getVerificationTwoStepByUserAndRol = async (req, res) => {
  try {
    const validAuth = await authRequest(req, res);

    const verificationFound =
      await VerificationTwoStepService.findVerificationByUserAndRol(
        validAuth.idUser,
        validAuth.idRol
      );

    res.status(200).json(verificationFound);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const updateStateVerificationByUserAndRol = async (req, res) => {
  try {
    const validAuth = await authRequest(req, res);
    
    if (!req.body)
      throw new Error("Body request null", {
        cause: { code: 400 }
      });

    if (req.body.newState == null)
      throw new Error("newState undefined", {
        cause: { code: 400 }
      });

    if (!req.body.confirmPassword)
      throw new Error("confirmPassword undefined", {
        cause: { code: 400 }
      });

    let confirmPassword = req.body.confirmPassword;
    let newState = req.body.newState;

    const verificationFound =
      await VerificationTwoStepService.changeStateVerificationTwoStep(
        validAuth.idUser,
        validAuth.idRol,
        newState,
        confirmPassword
      );

    res.status(200).json(verificationFound);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};
