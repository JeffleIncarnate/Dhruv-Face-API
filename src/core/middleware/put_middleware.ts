import { Request, Response, NextFunction } from "express";

const decode_token = require("../jwt/decrypt_token");

export let update_user: (
  req: Request,
  res: Response,
  next: NextFunction
) => any = (req: Request, res: Response, next: NextFunction) => {
  let authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  let decode = decode_token(token);

  if (decode.username !== req.body.username)
    return res
      .status(400)
      .send({ detail: "Token is not the same as user being updated" });

  next();
};

module.exports = {
  update_user,
};
