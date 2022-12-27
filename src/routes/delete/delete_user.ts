import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";
const bcrypt_compare = require("../../core/bcrypt/compare");
const authenticate_token = require("../../core/authentication/auth");
import { delete_user } from "../../core/middleware/delete_middleware";

let router = express.Router();

router.use(express.json());

// Custom UserDelete type
type UserDelete = {
  username: string;
  password: string;
};

router.delete(
  "/",
  authenticate_token,
  delete_user,
  async (req: Request, res: Response) => {
    let body = req.body;

    let user: UserDelete = {
      username: body.username,
      password: body.password,
    };

    let values_body = [body.username, body.password];

    for (let i = 0; i < values_body.length; i++) {
      if (values_body[i] === "" || values_body[i] === undefined)
        return res.status(400).send({ detail: "Provide all items" });
    }

    let sql_res_select;

    const query_select_password =
      "SELECT password FROM users WHERE username=$1";
    const values_select_password = [user.username];

    try {
      sql_res_select = await pool.query(
        query_select_password,
        values_select_password
      );
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    if (sql_res_select.rowCount === 0)
      return res.status(400).send({ detail: "User does not exist" });

    if (!(await bcrypt_compare(user.password, sql_res_select.rows[0].password)))
      return res.status(401).send({ detail: "Incorrect password" });

    let query_delete_user = "DELETE FROM users WHERE username=$1";
    let values_delete_user = [user.username];

    try {
      pool.query(query_delete_user, values_delete_user);
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    return res
      .status(200)
      .send({ detail: `Successfully deleted ${user.username}` });
  }
);

// Exporting the module, so we can use it from the main file
module.exports = router;
