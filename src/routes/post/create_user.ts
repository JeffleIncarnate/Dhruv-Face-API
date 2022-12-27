import express, { Request, Response } from "express";

import { pool } from "../../core/database/pool";
const roles = require("../../core/data/roles");
const authenticate_token = require("../../core/authentication/auth");
const decode_token = require("../../core/jwt/decrypt_token");
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
  middleware.create_user,
  async (req: Request, res: Response) => {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    let user_data: User = decode_token(token);

    user_data.role = roles.BASIC;

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

// Exporting the module, so we can use it from the main file
module.exports = router;
