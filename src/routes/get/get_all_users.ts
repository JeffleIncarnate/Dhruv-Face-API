import express, { Request, Response } from "express";
const pool = require("../../core/database/pool");

let router = express.Router();

router.get("/", (req: Request, res: Response) => {
  pool.query("SELECT NOW() as now", (err: any, sql_res: any) => {
    if (err) return res.status(500).send({ detail: err.stack });

    res.send(sql_res.rows[0]);
  });
});

// Exporting the module, so we can use it from the main file
module.exports = router;
