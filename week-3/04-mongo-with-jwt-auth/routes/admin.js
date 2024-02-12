const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const router = Router();

router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  await Admin.create({
    username,
    password,
  });
  res.json({
    message: "Admin created successfully",
  });
});

router.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const admin = await Admin.find({
    username,
    password,
  });

  if (admin) {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECRET
    );
    res.json({
      message: "Admin signed in successfully",
      token,
    });
  } else {
    res.json({
      message: "Admin not registered!",
    });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageLink = req.body.imageLink;
  const price = req.body.price;
  const course = await Course.create({
    title,
    description,
    imageLink,
    price,
  });
  res.json({
    message: "Course created successfully",
    courseId: course._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  const courses = await Course.find();
  res.json({
    courses: courses,
  });
});

module.exports = router;
