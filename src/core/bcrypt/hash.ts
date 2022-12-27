let bc = require("bcrypt");

/**
 * Hashs a password 12 times with the bcrypt blowfish hash (Haha blow joke) with a random salt. This is an async function
 * @param  {string} password             Not the hashed password
 * @return {Promise<string>}             This is the awaited hashed password
 */
export let bcrypt_hash: (password: string) => Promise<string> = async (
  password: string
) => {
  return await bc.hash(password, 12);
};
