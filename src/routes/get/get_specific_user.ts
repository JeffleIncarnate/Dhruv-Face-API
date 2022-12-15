import express, { Request, Response } from "express";

const pool = require("../../core/database/pool");

let router = express.Router();

router.get("/", (req: Request, res: Response) => {
  let username = req.query.username;

  if (username === "" || username === undefined)
    res.status(400).send({ detail: "Provide username" });

  let query_select_user = "SELECT * FROM users WHERE username=$1";
  let values_select_user = [username];

  pool.query(
    query_select_user,
    values_select_user,
    (err: any, sql_res: any) => {
      if (err) return res.status(500).send({ detail: err.stack });

      if (sql_res.rowCount === 0)
        return res.status(404).send({ detail: "User not found" });

      return res.send(sql_res.rows[0]);
    }
  );
});

// Exporting the module, so we can use it from the main file
module.exports = router;