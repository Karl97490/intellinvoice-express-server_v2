const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth.middlewares");

// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    res.status(400).json({ message: "First name and last name are required." });
    return;
  }

  const nameRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    res.status(400).json({ message: "First name or last name are incorrect." });
    return;
  }

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Email is incorrect." });
    return;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password is incorrect. Must be at least 8 characters long, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.",
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res.status(400).json({ message: "Email already exists. Please login." });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashPassword,
    };
    await User.create(newUser);

    res.status(201).json({ message: "user created." });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Email is incorrect." });
    return;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password incorrect. Must be at least 8 characters long, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.",
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res
        .status(400)
        .json({ message: "Email does not exists. Please signup." });
      return;
    }

    const checkPassword = await bcrypt.compare(password, foundUser.password);
    if (!checkPassword) {
      res
        .status(400)
        .json({ message: "Password does not match email. Please try again." });
      return;
    }

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ authToken });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/verify
router.get("/verify", verifyToken, async (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;
