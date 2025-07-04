import jwt from "jsonwebtoken";

export const authRequest = async (req, res) => {
  if (!process.env.JWT_SECRET_KEY)
    throw new Error("JWT secret key not declared");

  const secretKey = process.env.JWT_SECRET_KEY;
  let token;
  try {
    token = req.cookies.accessToken;

    if (!token) {
      let newToken = await newAccessToken(req, res);
      token = newToken;
    }

    if (secretKey) {
      try {
        const decodeToken = jwt.verify(token, secretKey, {
          algorithm: "HS256"
        });

        return decodeToken;
      } catch (error) {
        throw new Error("Authentication failed,invalid token");
      }
    }
  } catch (error) {
    throw error;
  }
};

export const authRequestResetPassword = async (req, res) => {
  if (!process.env.JWT_SECRET_KEY)
    throw new Error("JWT Secret key not declared");

  const secretKey = process.env.JWT_SECRET_KEY;
  const token = JSON.parse(req.header("Authorization").split(" ")[1]);

  let decodeToken;
  try {
    if (!token) {
      throw new Error("Invalid Authentication,token not found");
    }

    if (!secretKey) {
      throw new Error("Secret key not found");
    }

    try {
      decodeToken = jwt.verify(token, secretKey, {
        algorithm: "HS256"
      });
    } catch {
      throw new Error("Invalid Authentication,invalid token");
    }

    return decodeToken;
  } catch (error) {
    throw error;
  }
};

const newAccessToken = async (req, res) => {
  if (!process.env.JWT_SECRET_KEY)
    throw new Error("JWT secret key not declared");
  if (!process.env.JWT_SECRET_KEY_REFRESH)
    throw new Error("JWT secret refresh key not declared");

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
      { algorithm: "HS256", expiresIn: "1h" }
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

    return newToken;
  } catch (error) {
    throw error;
  }
};
