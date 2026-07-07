const { Schema, model } = require("mongoose");

const clientSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "name is required."],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: [true, "address is required."],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Client = model("Client", clientSchema);

module.exports = Client;
