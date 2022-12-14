let bc = require("bcrypt");

let hash_password: (password: string) => Promise<string> = (
  password: string
) => {
  return bc.hash(password, 12);
};

module.exports = hash_password;
