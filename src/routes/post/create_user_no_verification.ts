import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import date from "date-and-time";

import { pool } from "../../core/database/pool";
const roles = require("../../core/data/roles");
const bcrypt_hash = require("../../core/bcrypt/hash");
const authenticate_token = require("../../core/authentication/auth");
const middleware = require("../../core/middleware/post_middleware");

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
  middleware.create_user_no_verification,
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
      role: roles.BASIC, // string
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

        let query_insert_user_into_table =
          "INSERT INTO users (uuid, username, name, firstname, lastname, email, password, description, role, age, following, followers, posts, join_date, phonenumber) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)";
        let values_insert_user_into_table = [
          user_data.uuid,
          user_data.username,
          user_data.name,
          user_data.firstname,
          user_data.lastname,
          user_data.email,
          user_data.password,
          user_data.description,
          user_data.role,
          user_data.age,
          user_data.following,
          user_data.followers,
          user_data.posts,
          user_data.join_date,
          user_data.phonenumber,
        ];

        pool.query(
          query_insert_user_into_table,
          values_insert_user_into_table,
          (err_insert: any, sql_res_insert: any) => {
            if (err_insert)
              return res.status(500).send({ detail: err_insert.stack });

            res.status(201).send({
              detail: `Successfully created user ${user_data.username}`,
            });
          }
        );
      }
    );
  }
);

// Exporting the module, so we can use it from the main file
module.exports = router;
