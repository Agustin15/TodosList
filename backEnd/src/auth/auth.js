import jwt from "jsonwebtoken";

const authRequest = async (req, res) => {
  const secretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.cookies.accessToken;

    if (!token) {
      let tokenCreated = await newAccessToken(req, res);
      if (!tokenCreated) return;
    }

    if (secretKey) {
      try {
        const decodeToken = jwt.verify(token, secretKey);
        return decodeToken;
      } catch (error) {
        throw new Error("Authentication failed,invalid token");
      }
    }
  } catch (error) {}
};

const newAccessToken = async (req, res) => {
  const refreshKey = process.env.JWT_SECRET_KEY_REFRESH;
  const secretKey = process.env.JWT_SECRET_KEY;
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) {
      throw new Error("Authentication failed,invalid refresh token");
    }
    const decodedRefreshToken = jwt.verify(refreshToken, refreshKey);

    const newToken = jwt.sign(
      { idUser: decodedRefreshToken.idUser },
      secretKey,
      {
        expiresIn: "1h"
      }
    );

    if (!newToken) {
      throw new Error("Authentication failed,error to create access token");
    }
    res.cookie("accessToken", newToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return true;
  } catch {
    return false;
  }
};

export default authRequest;
