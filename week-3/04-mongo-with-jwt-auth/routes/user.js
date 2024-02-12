const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const { Types } = require("mongoose");
const { JWT_SECRET } = require("../config");

router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  await User.create({
    username,
    password,
  });
  res.json({
    message: "User created successfully",
  });
});

router.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.find({
    username,
    password,
  });

  if (user) {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECRET
    );
    res.json({
      message: "User signed in successfully",
      token,
    });
  } else {
    res.json({
      message: "User not registered!",
    });
  }
});

router.get("/courses", async (req, res) => {
  const courses = await Course.find();
  res.json({
    courses: courses,
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const courseId = req.params.courseId;
  const username = req.headers.username;
  await User.updateOne(
    { username: username },
    {
      $push: { purchasedCourses: courseId },
    }
  );

  res.json({
    message: "Course purchased successfully",
  });

  //   const course = await Course.findOne({ _id: Types.ObjectId(courseId) });

  //   if (!course)
  //     return res.status(404).json({
  //       message: "No course found with id: " + courseId,
  //     });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  const username = req.headers.username;
  const user = await User.findOne({
    username: username,
  });

  const courses = await Course.find({
    _id: {
      $in: user.purchasedCourses,
    },
  });
  res.json({
    courses: courses,
  });
});

module.exports = router;
