import express, { Request, Response } from "express";
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

import { pool } from "../../core/database/pool";
import { authenticate_token } from "../../core/authentication/auth";
import { create_post } from "../../core/middleware/post_middleware";

let router = express.Router();

router.use(express.json());

// Custom Post type
type Post = {
  description: string;
  tags: string[];
  image_videos: string;
  likes: number;
};

// note: Make middleware to check all items, to make sure they are not undefined, or just an empty string
router.post(
  "/",
  authenticate_token,
  create_post,
  upload.array("files"),
  (req: Request | any, res: Response) => {
    let post: Post = {
      description: req.body.description,
      tags: req.body.tags,
      image_videos: req.files[0].filename,
      likes: 0,
    };

    let query_get_posts = "SELECT posts FROM users WHERE username=$1";
    let values_get_posts = [req.body.username];

    pool.query(
      query_get_posts,
      values_get_posts,
      (err_select: any, sql_res_select: any) => {
        if (err_select)
          return res.status(500).send({ detail: err_select.stack });

        if (sql_res_select.rowCount === 0)
          return res.status(406).send({ detail: "User does not exist" });

        let current_json = [sql_res_select.rows[0].posts];
        let new_json = JSON.stringify(
          JSON.parse(
            JSON.stringify(current_json.concat([post])).replace(`'`, `"`)
          )
        );

        let query_update_posts = "UPDATE users SET posts=$1 WHERE username=$2";
        let values_update_posts = [new_json, req.body.username];

        pool.query(
          query_update_posts,
          values_update_posts,
          (err_update: any, sql_res_update: any) => {
            if (err_update)
              return res.status(500).send({ detail: err_update.stack });

            return res.status(200).send({ detail: "Success" });
          }
        );
      }
    );
  }
);

// Exporting the module, so we can use it from the main file
module.exports = router;
