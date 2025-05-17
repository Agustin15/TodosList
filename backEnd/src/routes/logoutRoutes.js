import express from "express";

export const logoutRoutes = express.Router();

logoutRoutes.get("/", function (req, res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ logout: true });
});
