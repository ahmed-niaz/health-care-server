import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const generateToken = (
  payload: string | object,
  secret: string | Secret,
  expiresIn: string | number
) => {
  // @ts-ignore
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
