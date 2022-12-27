import { Request, Response, NextFunction } from "express";

const roles = require("../data/roles");
const decode_token = require("../jwt/decrypt_token");

let check_role_basic_or_higher: (
  req: Request,
  res: Response,
  next: NextFunction
) => any = (req: Request, res: Response, next: NextFunction) => {
  let authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  let decode = decode_token(token).role;

  if (decode === roles.CREATE_USER)
    return res
      .status(400)
      .send({ detail: "Role must be higher than CREATE_USER" });

  next();
};

module.exports = {
  check_role_basic_or_higher,
};
