import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

const getSecret = () => process.env.JWT_SECRET || "default_jwt_secret";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, getSecret(), {
    expiresIn: expiresIn as any,
  });
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies?.[`${COOKIE_NAME}`];
  if (!token || typeof token !== "string" || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }
  return new Promise<void>((resolve) => {
    jwt.verify(token, getSecret(), (err: any, success: any) => {
      if (err) {
        res.status(401).json({ message: "Token Expired" });
        return resolve();
      } else {
        res.locals.jwtData = success;
        next();
        return resolve();
      }
    });
  });
};
