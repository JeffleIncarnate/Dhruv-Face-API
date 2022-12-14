import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const pool = require("../../core/database/pool");
const roles = require("../../core/data/roles");
const bcrypt_compare = require("../../core/bcrypt/compare");
const bcrypt_hash = require("../../core/bcrypt/hash");

let router = express.Router();

class User {
  public uuid;
  public username;
  public firstname;
  public lastname;
  public email;
  public password;
  public role;
  public age;

  constructor(
    uuid: string,
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role: string,
    age: number
  ) {
    this.uuid = uuid;
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.role = role;
    this.age = age;
  }
}

router.use(express.json());

router.post("/", async (req: Request, res: Response) => {
  let body = req.body;

  let user_data = {
    uuid: uuidv4(),
    username: body.username,
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email,
    password: await bcrypt_hash(body.password),
    role: roles.BASIC,
    age: body.age,
  };

  console.log(user_data);

  console.log(await bcrypt_compare(body.password, user_data.password));
});

// Exporting the module, so we can use it from the main file
module.exports = router;
