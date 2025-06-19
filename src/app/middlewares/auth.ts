import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../helpers/jwt.helpers";
import config from "../../config";
import apiError from "../errors/api.error";
import status from "http-status";

const auth = (...roles: string[]) => {
  // ! need to add call back fn
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(roles);
    try {
      const token = req.headers.authorization;
      console.log(token);

      if (!token) {
        throw new apiError(
          status.UNAUTHORIZED,
          "token is not found ⚠️ unauthorized user"
        );
      }

      //   todo: token has the userStatus , so need to verify
      const verifiedUser = verifyToken(
        token,
        config.jwt.jwt_access_token as string
      );

      // todo: set as req object

      req.user = verifiedUser;
      // console.log(verifiedUser);

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new apiError(
          status.FORBIDDEN,
          "token is not found ⚠️ unauthorized user"
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
