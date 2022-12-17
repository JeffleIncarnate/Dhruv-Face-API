import express, { Request, Response } from "express";
import { send } from "process";

const pool = require("../../core/database/pool");
const bcrypt_compare = require("../../core/bcrypt/compare");

let router = express.Router();

router.use(express.json());

type User = {
  username: string;
  password: string;
  column: string;
  change_to: string;
};

router.put("/", async (req: Request, res: Response) => {
  let column_exists = false;

  let user: User = {
    username: req.body.username,
    password: req.body.password,
    column: req.body.column,
    change_to: req.body.change_to,
  };

  let possible_columns = [
    "username",
    "name",
    "firstname",
    "lastname",
    "email",
    "description",
  ];

  for (let i = 0; i < possible_columns.length; i++)
    if (user.column.toLowerCase() === possible_columns[i]) column_exists = true;

  if (!column_exists)
    return res.status(406).send({ detail: "Column does not exist" });

  for (const [key, value] of Object.entries(user))
    if (value === undefined || value === null || value === "")
      return res.status(400).send({ detail: "Provide all values" });

  let query_get_password = "SELECT password FROM users WHERE username=$1";
  let values_get_password = [user.username];

  let res_get_password = await pool.query(
    query_get_password,
    values_get_password
  );

  if (!bcrypt_compare(user.password, res_get_password.rows[0].password))
    return res.status(400).send({ detail: "Incorrect password" });

  let query_update_user = `UPDATE users SET ${user.column}=$1 WHERE username=$2`;
  let values_update_user = [user.change_to, user.username];

  pool.query(query_update_user, values_update_user);

  return res.send({
    detail: `Successfully updated user "${user.username}"`,
    change: [{ column: user.column }, { to: user.change_to }],
  });
});

// Exporting the module, so we can use it from the main file
module.exports = router;
