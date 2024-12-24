import jwt from "jsonwebtoken";

const authRequest = (req) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const tokenObject = JSON.parse(req.headers.authorization?.split(" ")[1]);

  if (!tokenObject.token) {
    throw new Error("Authentication failed, missing token");
  }

  if (secretKey) {
    try {
      const decodeToken = jwt.verify(tokenObject.token, secretKey);
      return decodeToken;
    } catch (error) {
 
      throw new Error("Authentication failed,invalid token");
    }
  }
};

export default authRequest;
