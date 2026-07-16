const router = require("express").Router();
const User = require("../models/User.model");
const verifyToken = require("../middlewares/auth.middlewares");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// GET /api/users/:userId
// router.get("/:userId", verifyToken, async (req, res, next) => {
//   if (req.payload._id !== req.params.userId) {
//     res.status(401).json({ message: "Unauthorized access." });
//     return;
//   }

//   try {
//     const response = await User.findById(req.params.userId);
//     if (!response) {
//       res.status(400).json({ message: "User not found." });
//       return;
//     }
//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// PATCH /api/users/:userId
router.patch("/:userId", verifyToken, async (req, res, next) => {
  // Check if the id in the payload match with the id in the request params
  if (req.payload._id !== req.params.userId) {
    res.status(401).json({ message: "Unauthorized access." });
    return;
  }

  const { firstName, lastName, company } = req.body;

  if (!firstName || !lastName) {
    res.status(400).json({ message: "First and last name are required." });
    return;
  }

  const nameRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    res.status(400).json({ message: "First or last name are incorrect." });
    return;
  }

  // if (!company) {
  //   res.status(400).json({ message: "Company informations missing." });
  //   return;
  // }

  // if (!company.name && company) {
  //   res.status(400).json({ message: "Company name is required." });
  //   return;
  // }

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (!emailRegex.test(company?.email) && company?.email) {
    res.status(400).json({ message: "Email is incorrect." });
    return;
  }

  const validatePhone = company?.phone?.replace(/\D/g, "");
  if (
    (validatePhone?.length < 7 || validatePhone?.length > 15) &&
    company?.phone
  ) {
    res.status(400).json({ message: "Company phone number is incorrect." });
    return;
  }

  try {
    const updatedUser = {
      firstName,
      lastName,
      company: {
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
      },
    };
    const response = await User.findByIdAndUpdate(
      req.payload._id,
      updatedUser,
      { returnDocument: true, runValidators: true },
    );
    if (!response) {
      res.status(400).json({ message: "User not found." });
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.delete("/:userId", verifyToken, async (req, res, next) => {
  // Check if the id in the payload match with the id in the request params
  if (req.payload._id !== req.params.userId) {
    res.status(401).json({ message: "Unauthorized access." });
    return;
  }
  try {
    const response = await User.findByIdAndDelete(req.payload._id);
    if (!response) {
      res.status(400).json({ message: "User not found." });
      return;
    }
    res.status(200).json({ message: "user deleted." });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/password/:userId
// router.patch("/password/:userId", verifyToken, async (req, res, next) => {
//   // Check if the id in the payload match with the id in the request params
//   if (req.payload._id !== req.params.userId) {
//     res.status(401).json({ message: "Unauthorized access." });
//     return;
//   }

//   const { password } = req.body;
//   if (!password) {
//     res.status(400).json({ message: "Password is required." });
//     return;
//   }

//   const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
//   if (!passwordRegex.test(password)) {
//     res.status(400).json({
//       message:
//         "Password incorrect. Must be at least 8 characters long, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.",
//     });
//     return;
//   }

//   try {
//     const hashPassword = await bcrypt.hash(password, 12);

//     const response = await User.findByIdAndUpdate(
//       req.params.userId,
//       { password: hashPassword },
//       { returnDocument: true, runValidators: true },
//     );
//     if (!response) {
//       res.status(400).json({ message: "User not found." });
//       return;
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// PATCH /api/users/email/:userId
// router.patch("/email/:userId", verifyToken, async (req, res, next) => {
//   // Check if the id in the payload match with the id in the request params
//   if (req.payload._id !== req.params.userId) {
//     res.status(401).json({ message: "Unauthorized access." });
//     return;
//   }

//   const { email } = req.body;
//   if (!email) {
//     res.status(400).json({ message: "Email is required. " });
//     return;
//   }

//   const emailRegex =
//     /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
//   if (!emailRegex.test(email)) {
//     res.status(400).json({ message: "Email incorrect. Please try again." });
//     return;
//   }

//   if (email === req.payload.email) {
//     res.status(400).json({ message: "Email already use." });
//     return;
//   }

//   try {
//     const foundUser = await User.findOne({ email });
//     if (foundUser) {
//       res.status(400).json({ message: "Email already exists." });
//       return;
//     }

//     const response = await User.findByIdAndUpdate(
//       req.params.userId,
//       { email },
//       { returnDocument: true, runValidators: true },
//     );
//     if (!response) {
//       res.status(400).json({ message: "User not found." });
//       return;
//     }

//     const payload = {
//       _id: req.payload._id,
//       email,
//     };

//     const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
//       expiresIn: "7d",
//     });
//     res.status(200).json({ authToken });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
