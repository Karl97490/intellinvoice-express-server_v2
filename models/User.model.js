const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "lastName is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required."],
      unique: [true, "email is unique."],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    company: {
      name: { type: String, trim: true },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      phone: { type: String, trim: true },
      address: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = model("User", userSchema);

module.exports = User;
