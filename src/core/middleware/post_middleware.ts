import { Request, Response, NextFunction } from "express";

const roles = require("../data/roles");
import { pool } from "../database/pool";
const decode_token = require("../jwt/decrypt_token");

let verify_password: (
  username: string,
  normal_password: string
) => Promise<boolean> = async (username: string, hashed_password: string) => {
  let query_verify_password = "SELECT password FROM users WHERE username=$1";
  let values_verify_password = [username];

  let sql_res = await pool.query(query_verify_password, values_verify_password);

  return hashed_password === sql_res.rows[0].password ? true : false;
};

let create_post: (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (!(await verify_password(req.user.username, req.user.password)))
    return res.status(400).send({ detail: "passwords are not equal." });

  next();
};

let create_user_no_verification: (
  req: Request,
  res: Response,
  next: NextFunction
) => any = (req: Request, res: Response, next: NextFunction) => {
  let authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  let decode = decode_token(token).role;

  if (decode !== roles.GOD && decode !== roles.ADMIN)
    return res.status(401).send({ detail: "You need to be ADMIN or higher" });

  next();
};

let create_user: (req: Request, res: Response, next: NextFunction) => any = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  let decode = decode_token(token).role;

  if (decode !== roles.CREATE_USER)
    return res.status(401).send({ detial: "Incorrect token" });

  next();
};

let user_login: (req: Request, res: Response, next: NextFunction) => any = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  let decode = decode_token(token).username;

  return decode === req.body.username
    ? next()
    : res.status(400).send({ detail: "Token is the same as user" });
};

let verify_email_create_user: (
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
      .send({ detail: "Body username is not the same as the token username" });

  if (decode.role !== roles.CREATE_USER)
    return res
      .status(400)
      .send({ detail: "Token role is not correct must be `create_user`" });

  next();
};

module.exports = {
  create_post,
  create_user_no_verification,
  create_user,
  user_login,
  verify_email_create_user,
};
