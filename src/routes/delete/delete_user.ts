import express, { Request, Response } from "express";

const pool = require("../../core/database/pool");
const bcrypt_compare = require("../../core/bcrypt/compare");
const authenticate_token = require("../../core/authentication/auth");

let router = express.Router();

router.use(express.json());

// Custom UserDelete type
type UserDelete = {
  username: string;
  password: string;
};

router.delete("/", authenticate_token, (req: Request, res: Response) => {
  let body = req.body;

  let user: UserDelete = {
    username: body.username,
    password: body.password,
  };

  let values_body = [body.username, body.password];

  for (let i = 0; i < values_body.length; i++) {
    if (values_body[i] === "" || values_body[i] === undefined)
      return res.status(400).send({ detail: "Provide all items" });
  }

  let query_select_password = "SELECT password FROM users WHERE username=$1";
  let values_select_password = [user.username];

  pool.query(
    query_select_password,
    values_select_password,
    async (err_select_password: any, sql_res_select_password: any) => {
      if (err_select_password)
        return res.status(500).send({ detail: err_select_password.stack });

      if (sql_res_select_password.rowCount === 0)
        return res.status(400).send({ detail: "User does not exist" });

      if (
        !(await bcrypt_compare(
          user.password,
          sql_res_select_password.rows[0].password
        ))
      )
        return res.status(401).send({ detail: "Incorrect password" });

      let query_delete_user = "DELETE FROM users WHERE username=$1";
      let values_delete_user = [user.username];

      pool.query(
        query_delete_user,
        values_delete_user,
        (err_delete_user: any, sql_res_delete_user: any) => {
          if (err_delete_user)
            return res.status(500).send({ detail: err_delete_user.stack });

          return res
            .status(200)
            .send({ detail: `Successfully deleted ${user.username}` });
        }
      );
    }
  );
});

// Exporting the module, so we can use it from the main file
module.exports = router;
