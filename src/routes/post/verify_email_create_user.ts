import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import date from "date-and-time";

import { pool } from "../../core/database/pool";
import { roles } from "../../core/data/roles";
import { bcrypt_hash } from "../../core/bcrypt/hash";
import { authenticate_token } from "../../core/authentication/auth";
import { create_token } from "../../core/jwt/create_token";
import { verify_email_create_user } from "../../core/middleware/post_middleware";

let router = express.Router();

router.use(express.json());

type User = {
  uuid: string;
  username: string;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  password: string;
  description: string;
  role: string;
  age: number;
  following: any;
  followers: any;
  posts: any;
  join_date: string;
};

router.post(
  "/",
  authenticate_token,
  verify_email_create_user,
  async (req: Request, res: Response) => {
    let body = req.body;
    let date_time_now = new Date();

    let items = [
      body.username,
      body.name,
      body.firstname,
      body.lastname,
      body.email,
      body.phonenumber,
      body.password,
      body.description,
      body.age,
    ];

    for (let i = 0; i < items.length; i++)
      if (items[i] === undefined || items[i] === "")
        return res.status(400).send({ detail: "Provide all values" });

    let user_data: User = {
      uuid: uuidv4(), // string
      username: body.username, // string, must be unique
      name: body.name, // string, this can be the same
      firstname: body.firstname, // string
      lastname: body.lastname, // string
      email: body.email, // string
      phonenumber: body.phonenumber, // string
      password: await bcrypt_hash(body.password), // string
      description: body.description, // string
      role: roles.CREATE_USER, // string
      age: body.age, // int8
      following: [], // json
      followers: [], // json
      posts: [], // json
      join_date: date.format(date_time_now, "YYYY/MM/DD HH:mm:ss"), // string
    };

    let query_check_username_exists = "SELECT * FROM users WHERE username=$1";
    let values_check_username_exists = [user_data.username];

    pool.query(
      query_check_username_exists,
      values_check_username_exists,
      (err_exists: any, sql_res_exists: any) => {
        if (err_exists)
          return res.status(500).send({ detail: err_exists.stack });

        if (sql_res_exists.rowCount !== 0)
          return res
            .status(406)
            .send({ detail: "Someone with that username exists." });

        return res.send({ verify_user_token: create_token(user_data) });
      }
    );
  }
);

// Exporting the module, so we can use it from the main file
module.exports = router;
