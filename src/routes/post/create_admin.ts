import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { pool } from "../../core/database/pool";
const roles = require("../../core/data/roles");
const authenticate_token = require("../../core/authentication/auth");
import { create_admin } from "../../core/middleware/post_middleware";

let router = express.Router();

router.use(express.json());

type User = {
  uuid: string;
  username: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  password: string;
  age: number;
  role: string;
};

router.post(
  "/",
  authenticate_token,
  create_admin,
  async (req: Request, res: Response) => {
    let body = req.body;

    let items = [
      body.username,
      body.firstname,
      body.lastname,
      body.phonenumber,
      body.password,
      body.age,
    ];

    for (let i = 0; i < items.length; i++)
      if (items[i] === undefined || items[i] === "")
        return res.status(400).send({ detail: "Provide all values" });

    let user: User = {
      uuid: uuidv4(),
      username: body.username,
      firstname: body.firstname,
      lastname: body.lastname,
      phonenumber: body.phonenumber,
      password: body.password,
      age: body.age,
      role: roles.GOD,
    };

    let sql_res_select;

    const query_select_username =
      "SELECT username FROM admins WHERE username=$1";
    const values_select_username = [user.username];

    try {
      sql_res_select = await pool.query(
        query_select_username,
        values_select_username
      );
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }

    if (sql_res_select.rowCount !== 0)
      return res
        .status(400)
        .send({ detail: "User with that username already exists" });

    const query_insert_admin =
      "INSERT INTO admins (uuid, username, firstname, lastname, phonenumber, password, age, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const values_insert_admin = [
      user.uuid,
      user.username,
      user.firstname,
      user.lastname,
      user.phonenumber,
      user.password,
      user.age,
      user.role,
    ];

    try {
      await pool.query(query_insert_admin, values_insert_admin);
    } catch (err: any) {
      return res.status(500).send({ detail: err.stack });
    }
  }
);

// Exporting the module, so we can use it from the main file
module.exports = router;
