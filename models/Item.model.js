const { Schema, model } = require("mongoose");

const itemSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  unitPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Item = model("Item", itemSchema);

module.exports = Item;
