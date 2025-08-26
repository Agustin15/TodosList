import { helpQueryService } from "../services/helpQueryService.js";

export const sendQueryClient = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0 || !req.body)
      throw new Error("Body request null", {
        cause: { code: 400 }
      });

    if (!req.body.name)
      throw new Error("Name undefined", {
        cause: { code: 400 }
      });
    if (!req.body.description)
      throw new Error("Description undefined", {
        cause: { code: 400 }
      });
    if (!req.body.emailClient)
      throw new Error("Email client undefined", {
        cause: { code: 400 }
      });
    const { name, description, emailClient } = req.body;

    const emailSent = helpQueryService.sendEmailQuery(
      name,
      description,
      emailClient,
      req.files
    );

    if (!emailSent) throw new Error("Could not send the query");
    res.status(200).json({ emailSent: emailSent.messageId });
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};
