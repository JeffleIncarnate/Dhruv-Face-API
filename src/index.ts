import express, { Application, Request, Response } from "express";
const app: Application = express();
let port: number = 3000;

// Routes -- GET
// GET -- GET ALL USERS
const get_all_users = require("./routes/get/get_all_users");
// GET -- GET SPECIFIC USER
const get_specific_user = require("./routes/get/get_specific_user");

// ---------------------------- //

// Routes -- POST
// POST -- CREATE USER
const create_user = require("./routes/post/create_user");
// POST -- USER LOGIN
const user_login = require("./routes/post/user_login");
// POST -- CREATE POST
const create_post = require("./routes/post/create_post");

// ---------------------------- //

// Routes -- DELETE
// DELETE -- DELETE USER
const delete_user = require("./routes/delete/delete_user");

// ---------------------------- //

// Use Routes -- GET
// USE GET -- GET ALL USERS
app.use("/get/get_all_users", get_all_users);
// USE GET -- GET SPECIFIC USE
app.use("/get/get_specific_user", get_specific_user);

// ---------------------------- //

// Use Routes -- POST
// USE POST -- CREATE USER
app.use("/post/create_user", create_user);
// USE POST -- USER LOGIN
app.use("/post/user_login", user_login);
// USE POST -- CREATE POST
app.use("/post/create_post", create_post);

// ---------------------------- //

// Use Routes -- DELETE
// USE DELETE -- DELETE USER
app.use("/delete/delete_user", delete_user);

app.get("/", (req: Request, res: Response) => {
  res.send({ detail: "Welcome to the Dhruv-Face API!" });
});

// Fallback
app.all("*", (req: Request, res: Response) => {
  res.status(404).send({
    detail: "This endpoint does not exist, please pick one that does",
  });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
