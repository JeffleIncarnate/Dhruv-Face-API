const jwt = require("jsonwebtoken");

export let decode_token: (token: string) => any = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
