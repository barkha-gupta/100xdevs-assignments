const jwt = require("jsonwebtoken");
const { Admin } = require("../db/index");
const { JWT_SECRET } = require("../config");

async function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const words = token.split(" ");
  const jwtToken = words[1];
  const decode = jwt.verify(jwtToken, JWT_SECRET);
  if (decode.username) {
    next();
  } else {
    res.status(403).json({
      message: "You are not authenticated",
    });
  }
}

module.exports = adminMiddleware;
