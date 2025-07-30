import { LoginService } from "../services/loginService.js";
export const login = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Body request null");
    }

    if (!req.body.email) throw new Error("email undefined");
    if (!req.body.password) throw new Error("password undefined");

    const { email, password } = req.body;

    const loginResult = await LoginService.login(email, password);

    if (loginResult.refreshToken && loginResult.token) {
      res.cookie("accessToken", loginResult.token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });

      res.cookie("refreshToken", loginResult.refreshToken, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });
      res.status(200).json({ userHasVerification: false });
    } else if (loginResult.idUser)
      res
        .status(200)
        .json({ userHasVerification: true, idUser: loginResult.idUser });
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }
};
