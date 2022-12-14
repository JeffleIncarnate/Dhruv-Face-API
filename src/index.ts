import express, { Application, Request, Response } from "express";
const app: Application = express();
let port: number = 3000;

// Routes -- GET
// GET -- GET ALL USERS
const get_all_users = require("./routes/get/get_all_users");

// Routes -- POST
// POST -- CREATE USER
const create_user = require("./routes/post/create_user");

// Use Routes -- GET
// USE GET -- GET ALL USERS
app.use("/get/get_all_users", get_all_users);

// Use Routes -- POST
// USE POST -- CREATE USER
app.use("/post/create_user", create_user);

app.get("/", (req: Request, res: Response) => {
  res.send({ detail: "Welcome to the Dhruv-Face API!" });
});

// Fallback
app.all("*", (req: Request, res: Response) => {
  res.send({
    detail: "This endpoint does not exist, please pick one that does",
  });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
