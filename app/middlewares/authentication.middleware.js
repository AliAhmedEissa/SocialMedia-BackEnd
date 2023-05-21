import { sendErrorResponse } from "../helpers/utils.js";
import jwt from "jsonwebtoken";

export const tokenAuthentication = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (token) {
      const parsedToken = jwt.verify(token, process.env.TOKEN_SIGNATURE);
      req.user_id = parsedToken._id;
      next();
    } else {
      sendErrorResponse(next, "user must logged in first", 400);
    }
  } catch (error) {
    sendErrorResponse(next, error.message, 400);
  }
};

export default tokenAuthentication;
