import jwt from "jsonwebtoken";

export const generateToken = ({
  payload = {},
  signature = process.env.TOKEN_SIGNATURE,
}) => {
  if (Object.keys(payload).length) {
    const token = jwt.sign(payload, signature);
    return token;
  }
  return false;
};

export const decodeToken = ({
  payload = "",
  signature = process.env.TOKEN_SIGNATURE,
}) => {
  if (!payload) {
    return false;
  }
  const decode = jwt.verify(payload, signature);
  return decode;
};