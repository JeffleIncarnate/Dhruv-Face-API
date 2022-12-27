import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";
const authenticate_token = require("../../core/authentication/auth");
import { get_all_users } from "../../core/middleware/get_middleware";

let router = express.Router();

router.get(
  "/",
  authenticate_token,
  get_all_users,
  (req: Request, res: Response) => {
    let query_select_all = "SELECT * FROM users";

    pool.query(query_select_all, (err: any, sql_res: any) => {
      if (err) return res.status(500).send({ detail: err.stack });

      res.send(sql_res.rows);
    });
  }
);

// Exporting the module, so we can use it from the main file
module.exports = router;
