import { Request, Response, NextFunction } from "express";

const roles = require("../data/roles");
const decode_token = require("../jwt/decrypt_token");

export let delete_user: (
  req: Request,
  res: Response,
  next: NextFunction
) => any = (req: Request, res: Response, next: NextFunction) => {
  let authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  let decode = decode_token(token);

  if (decode.role === roles.ADMIN || decode.role === roles.GOD) return next();

  if (decode.username === req.body.username) {
    next();
  } else {
    return res
      .status(401)
      .send({ detial: "Token must be the same as the user being deleated." });
  }
};
