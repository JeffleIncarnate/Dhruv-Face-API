const jwt = require("jsonwebtoken");

let decode_token: (token: string) => any = (token: string) => {
  let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded;
};

module.exports = decode_token;
