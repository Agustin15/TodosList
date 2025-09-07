import { LoginService } from "../services/loginService.js";
export const login = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Body request null");
    }

    if (!req.body.email)
      throw new Error("email undefined", {
        cause: { code: 400 }
      });
    if (!req.body.password)
      throw new Error("password undefined", {
        cause: { code: 400 }
      });

    const { email, password } = req.body;

    const loginResult = await LoginService.login(email, password);

    if (loginResult.refreshToken && loginResult.token) {
      res.cookie("accessToken", loginResult.token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "lax"
      });

      res.cookie("refreshToken", loginResult.refreshToken, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "lax"
      });

    
      res.status(200).json({ userHasVerification: false });
    } else if (loginResult.tokenVerification)
      res.status(200).json({
        userHasVerification: true,
        tokenVerification: loginResult.tokenVerification
      });
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 401)
      .json({ messageError: error.message });
  }
};
