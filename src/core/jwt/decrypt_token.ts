const jwt = require("jsonwebtoken");

/**
 * This function will decryt the token
 * @param  {string} token      Not the hashed password
 * @return {string}            Returns the payload, which is normally of type json, but idk they type, so we just gotta go with any
 */
export let decode_token: (token: string) => any = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
