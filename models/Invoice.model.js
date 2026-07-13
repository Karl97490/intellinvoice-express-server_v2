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
      trim: true,
      uppercase: true,
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
    items: {
      type: [
        {
          title: {
            type: String,
            required: true,
            trim: true,
          },
          quantity: {
            type: Number,
            default: 1,
            min: 1,
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
      validate: {
        validator: (items) => items.length > 0,
        message: "Invoice must contain at least one item.",
      },
    },
    status: {
      type: String,
      enum: ["paid", "unpaid", "overdue", "pending"],
      default: "pending",
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: Date.now,
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
    subTotal: {
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
