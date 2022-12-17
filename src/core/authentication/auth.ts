import { Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `${__dirname}/../../.env` });

let authenticate_token: (req: any, res: Response, next: NextFunction) => any = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401);

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ result: "Forbidden" });

    req.user = user;
    next();
  });
};

// Exporting this, so we can use it in any file.
module.exports = authenticate_token;
