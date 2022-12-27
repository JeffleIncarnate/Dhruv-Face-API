import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";
import { authenticate_token } from "../../core/authentication/auth";
import { get_specific_user } from "../../core/middleware/get_middleware";

let router = express.Router();

router.get(
  "/",
  authenticate_token,
  get_specific_user,
  async (req: Request, res: Response) => {
    let username = req.query.username;

    if (username === "" || username === undefined)
      res.status(400).send({ detail: "Provide username" });

    const query_select_user = "SELECT * FROM users WHERE username=$1";
    const values_select_user = [username];

    let sql_res_select;

    try {
      sql_res_select = await pool.query(query_select_user, values_select_user);
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    if (sql_res_select.rowCount === 0)
      return res.status(404).send({ detail: "User not found" });

    return res.send(sql_res_select.rows[0]);
  }
);

// Exporting the module, so we can use it from the main file
module.exports = router;
