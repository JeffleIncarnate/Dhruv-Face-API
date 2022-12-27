import express, { Request, Response } from "express";
require("dotenv").config({ path: "../../.env" });

import { pool } from "../database/pool";
import { bcrypt_compare } from "../bcrypt/compare";
import { roles } from "../data/roles";
import { create_token } from "../jwt/create_token";

let router = express.Router();

router.use(express.json());

type UserToken = {
  username: string;
  role: string;
  password: string;
  can_access_dashboard: boolean;
};

type PostUser = {
  username: string;
  role: string;
  can_access_dashboard: boolean;
};

type Token = {
  token: string;
};

router.post("/admin", async (req: Request, res: Response) => {
  const query_get_password =
    "select password, role from admins where username=$1";
  const values_get_password = [req.body.username];

  const items = [req.body.username, req.body.password];

  for (let i = 0; i < items.length; i++)
    if (items[i] === undefined || items[i] === "")
      return res.send({ detail: "Provide all values" });

  let sql_res_get_pass;

  try {
    sql_res_get_pass = await pool.query(
      query_get_password,
      values_get_password
    );
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  if (sql_res_get_pass.rowCount === 0)
    return res.status(400).send({ detail: "This admin does not exist" });

  if (
    !(await bcrypt_compare(
      req.body.password,
      sql_res_get_pass.rows[0].password
    ))
  )
    return res.status(400).send({ detail: "Incorrect password" });

  let user: UserToken = {
    username: req.body.username,
    role: sql_res_get_pass.rows[0].role,
    password: sql_res_get_pass.rows[0].password,
    can_access_dashboard: true,
  };

  let access_token: Token = {
    token: create_token(user),
  };

  console.log("created admin with token: " + user.role);

  return res.send({ adminAccessToken: access_token.token });
});

router.post("/user", async (req: Request, res: Response) => {
  const query_get_password =
    "select password, role from users where username=$1";
  const values_get_password = [req.body.username];

  const items = [req.body.username, req.body.password];

  for (let i = 0; i < items.length; i++)
    if (items[i] === undefined || items[i] === "")
      return res.send({ detail: "Provide all values" });

  let sql_res_get_pass;

  try {
    sql_res_get_pass = await pool.query(
      query_get_password,
      values_get_password
    );
  } catch (err: any) {
    return res.status(500).send({ detail: err.stack });
  }

  if (sql_res_get_pass.rowCount === 0) {
    let user: PostUser = {
      username: req.body.username,
      role: roles.CREATE_USER,
      can_access_dashboard: false,
    };

    let access_token: Token = {
      token: create_token(user),
    };

    console.log("created user with token: " + user.role);

    return res.send({ postAccessToken: access_token.token });
  }

  if (
    !(await bcrypt_compare(
      req.body.password,
      sql_res_get_pass.rows[0].password
    ))
  )
    return res.status(400).send({ detail: "Incorrect password" });

  let user: UserToken = {
    username: req.body.username,
    role: sql_res_get_pass.rows[0].role,
    password: sql_res_get_pass.rows[0].password,
    can_access_dashboard: false,
  };

  let access_token: Token = {
    token: create_token(user),
  };

  console.log("created user with token: " + user.role);

  return res.send({ accessToken: access_token.token });
});

module.exports = router;
