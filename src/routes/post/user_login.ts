import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";
import { bcrypt_compare } from "../../core/bcrypt/compare";
import { authenticate_token } from "../../core/authentication/auth";
import { user_login } from "../../core/middleware/post_middleware";

let router = express.Router();

router.use(express.json());

type UserLogin = {
  username: string;
  password: string;
};

router.post(
  "/",
  authenticate_token,
  user_login,
  async (req: Request, res: Response) => {
    let body = req.body;

    let user: UserLogin = {
      username: body.username,
      password: body.password,
    };

    let values_body = [body.username, body.password];

    for (let i = 0; i < values_body.length; i++)
      if (values_body[i] === "" || values_body[i] === undefined)
        return res.status(400).send({ detail: "Provide all items" });

    let query_get_password = "SELECT password FROM users WHERE username=$1";
    let values_get_password = [user.username];

    pool.query(
      query_get_password,
      values_get_password,
      async (err_get_password: any, sql_res_get_password: any) => {
        if (err_get_password)
          return res.status(500).send({ detail: err_get_password.stack });

        if (sql_res_get_password.rowCount === 0)
          return res.status(400).send({ detail: "User does not exist" });

        return (await bcrypt_compare(
          user.password,
          sql_res_get_password.rows[0].password
        ))
          ? res.status(200).send({ detail: "Success" })
          : res.status(400).send({ detail: "Incorret password" });
      }
    );
  }
);

// Exporting the module, so we can use it from the main file
module.exports = router;
