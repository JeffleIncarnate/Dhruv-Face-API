const jsonewebtoken = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

type UserToken = {
  username: string;
  role: string;
  password: string;
};

type PostUser = {
  username: string;
  role: string;
};

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

export let create_token: (user: UserToken | PostUser | User) => any = (
  user: UserToken | PostUser
) => {
  return jsonewebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET);
};
