import express from "express";
import jwt from "jsonwebtoken";

export const stateTokenRoutes = express.Router();

stateTokenRoutes.get("/", (req, res) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = JSON.parse(req.headers.authorization?.split(" ")[1]);

  if (!token) {
    throw new Error("Authentication failed, missing token");
  }
  if (secretKey) {
    try {
      const decodeToken = jwt.verify(token, secretKey);
      if (decodeToken.exp - Date.now() / 1000 <= 35) {
        res.status(200).json({ message: true });
      } else {
        res.status(200).json({ message: false });
      }
    } catch (error) {
      res
        .status(404)
        .json({ messageError: "Authentication failed,invalid token" });
    }
  }
});

stateTokenRoutes.post("/:username", (req, res) => {
  const username = req.params.username;
  const secretKey = process.env.JWT_SECRET_KEY;
  const secretKeyRefresh = process.env.JWT_SECRET_KEY_REFRESH;
  const refreshToken = JSON.parse(req.headers.authorization?.split(" ")[1]);

  if (!refreshToken) {
    throw new Error("Authentication failed, missing refresh token");
  }
  if (secretKeyRefresh) {
    try {
      jwt.verify(refreshToken, secretKeyRefresh);

      const newToken = jwt.sign({ username: username }, secretKey, {
        expiresIn: "1h",
      });

      res.status(200).json(newToken);
    } catch (error) {
      res
        .status(404)
        .json({ messageError: "Authentication failed,invalid refresh token" });
    }
  }
});
