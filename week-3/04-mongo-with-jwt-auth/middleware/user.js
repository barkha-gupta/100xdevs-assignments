const { User } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

async function userMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const words = token.split(" ");
  const jwtToken = words[1];
  const decode = jwt.verify(jwtToken, JWT_SECRET);
  if (decode.username) {
    req.username = decode.username;
    next();
  } else {
    res.status(403).json({
      message: "You are not authenticated",
    });
  }
}

module.exports = userMiddleware;
