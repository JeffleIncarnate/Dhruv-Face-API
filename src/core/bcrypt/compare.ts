const bcrypt = require("bcrypt");

/**
 * Compares 2 passwords, a hashed password and a non hashed password, if they are the same it returns true if not, then false
 * @param  {string} normal_pass             Not the hashed password
 * @param  {string} hashed_password         The second number
 * @return {Promise<boolean>}               A boolean to confirm is the passwords are the same
 */

export let bcrypt_compare: (
  normal_pass: string,
  hash_pass: string
) => Promise<boolean> = async (normal_pass: string, hash_pass: string) => {
  return await bcrypt.compare(normal_pass, hash_pass);
};
