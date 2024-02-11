// Middleware for handling auth
const { Admin } = require("../db/index");
async function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const username = req.headers.username;
  const password = req.headers.password;
  const admin = await Admin.findOne({
    username: username,
    password: password,
  });
  if (!admin) {
    res.status(411).json({
      message: "No admin found!",
    });
  } else {
    next();
  }
}

module.exports = adminMiddleware;
