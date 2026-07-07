const { Schema, model } = require("mongoose");

const invoiceSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    invoiceNumber: {
      type: String,
      required: [true, "InvoiceNumber is required."],
      unique: [true, "invoiceNumber is unique."],
      min: 1,
    },
    owner: {
      // firstName: { type: String, required: true, trim: true },
      // lastName: { type: String, required: true, trim: true },
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      address: { type: String, required: true, trim: true },
      phone: { type: String, trim: true },
    },
    client: {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      address: { type: String, required: true, trim: true },
      phone: { type: String, trim: true },
    },
    items: [
      {
        itemId: { type: Schema.Types.ObjectId, ref: "Item" },
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
      },
    ],
    status: {
      type: String,
      enum: ["paid", "unpaid", "overdue", "pending"],
    },
    issuedDate: {
      type: Date,
      default: new Date(),
    },
    dueDate: {
      type: Date,
      default: new Date(),
    },
    subTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Invoice = model("Invoice", invoiceSchema);

module.exports = Invoice;
