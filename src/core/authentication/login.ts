import express, { Request, Response } from "express";
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

let pool = require("../database/pool");
let bcrypt_compare = require("../bcrypt/compare");
let roles = require("../data/roles");

let router = express.Router();

router.use(express.json());

type UserToken = {
  username: string;
  role: string;
  password: string;
};

type Token = {
  token: string;
};

router.post("/", async (req: Request, res: Response) => {
  // Querying the database
  let query_get_password = "select password, role from users where username=$1";
  let values_get_password = [req.body.username];

  let items = [req.body.username, req.body.password];

  for (let i = 0; i < items.length; i++) {
    if (items[i] === undefined || items[i] === "")
      return res.send({ detail: "Provide all values" });
  }

  let sql_res_get_pass = await pool.query(
    query_get_password,
    values_get_password
  );

  if (sql_res_get_pass.rowCount === 0)
    return res.status(400).send({ detail: "User does not exist" });

  if (
    !(await bcrypt_compare(
      req.body.password,
      sql_res_get_pass.rows[0].password
    ))
  ) {
    return res.status(400).send({ detail: "Incorrect password" });
  }

  let user: UserToken = {
    username: req.body.username,
    role: sql_res_get_pass.rows[0].role,
    password: sql_res_get_pass.rows[0].password,
  };

  let access_token: Token = {
    token: generateAccessToken(user),
  };

  console.log("created user with token: " + user.role);

  res.send({ accessToken: access_token.token });
});

// Function to generate the access token.
function generateAccessToken(user: UserToken) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = router;
