let bcrypt = require("bcrypt");

let compare_passwords: (
  normal_pass: string,
  hash_pass: string
) => Promise<Boolean> = async (normal_pass: string, hash_pass: string) => {
  return await bcrypt.compare(normal_pass, hash_pass);
};

module.exports = compare_passwords;
