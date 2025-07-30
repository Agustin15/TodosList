import { VerificationCodeService } from "../services/verificationCodeService.js";

export const sendVerificationCode = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Body request null");
    }

    if (!req.body.idUser) {
      throw new Error("idUser undefined");
    }

    let idUser = req.body.idUser;

    const verificationSent = await VerificationCodeService.sendVerificationCode(
      idUser
    );

    res.status(200).json(verificationSent);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const comprobateVerificationCode = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Body request null");
    }

    if (!req.body.idUser) {
      throw new Error("idUser undefined");
    }
    if (!req.body.codeEntered) {
      throw new Error("codeEntered undefined");
    }

    const { idUser, codeEntered } = req.body;

    const verificationCodeValid =
      await VerificationCodeService.comprobateVerificationCode(
        codeEntered,
        idUser
      );

    res.status(200).json(verificationCodeValid);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
