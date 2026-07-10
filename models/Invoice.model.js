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
      required: [true, "invoiceNumber is required."],
      min: 1,
    },
    owner: {
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
    // allows to have no items to invoice when created but if one trigger the validation schema for title
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
        taxRate: {
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
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    subTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxRate: {
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

// allows to have invoice number unique per user/company
invoiceSchema.index({ ownerId: 1, invoiceNumber: 1 }, { unique: true });

const Invoice = model("Invoice", invoiceSchema);

module.exports = Invoice;
