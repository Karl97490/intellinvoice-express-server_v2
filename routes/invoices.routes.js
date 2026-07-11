const router = require("express").Router();
const Invoice = require("../models/Invoice.model");
const User = require("../models/User.model");
const verifyToken = require("../middlewares/auth.middlewares");
const mongoose = require("mongoose");

// GET /api/invoices/
router.get("/", verifyToken, async (req, res, next) => {
  console.log(req.query);

  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  console.log(page, limit);
  const { search, issuedDate, dueDate, status } = req.query;
  const activeStatuses = Object.keys(status || {}).filter(
    (key) => status[key] === "true",
  );
  // console.log(activeStatuses);
  const filter = { ownerId: req.payload._id };

  if (search) {
    filter.$or = [
      { "client.name": { $regex: search, $options: "i" } },
      { invoiceNumber: { $regex: search } },
    ];
  }

  if (issuedDate) {
    filter.issuedDate = { $gte: new Date(issuedDate) };
  }

  if (dueDate) {
    filter.dueDate = { $lte: new Date(dueDate) };
  }

  if (activeStatuses.length > 0) {
    filter.status = { $in: activeStatuses };
  }

  console.log(filter);
  try {
    const response = await Invoice.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
    // if (!response.length) {
    //   const response = await Invoice.find({ ownerId: req.payload._id });
    //   res.status(200).json(response);
    //   return;
    // }
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/invoices/stats
router.get("/stats", verifyToken, async (req, res, next) => {
  try {
    const totalInvoices = await Invoice.countDocuments({
      ownerId: req.payload._id,
    });
    const stats = await Invoice.aggregate([
      {
        $match: { ownerId: new mongoose.Types.ObjectId(req.payload._id) },
      },
      {
        $group: {
          _id: null,
          totalPaid: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$total", 0],
            },
          },
          totalUnpaid: {
            $sum: {
              $cond: [{ $eq: ["$status", "unpaid"] }, "$total", 0],
            },
          },
          totalAmount: { $sum: "$total" },
        },
      },
    ]);

    const result =
      stats.length > 0
        ? stats[0]
        : { totalPaid: 0, totalUnpaid: 0, totalAmount: 0 };

    console.log(result, totalInvoices);
    res.status(200).json({
      totalInvoices,
      totalPaid: result.totalPaid,
      totalUnpaid: result.totalUnpaid,
      totalAmount: result.totalAmount,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/invoices/:invoiceId
router.get("/:invoiceId", verifyToken, async (req, res, next) => {
  try {
    const response = await Invoice.findOne({
      _id: req.params.invoiceId,
      ownerId: req.payload._id,
    });
    if (!response) {
      res.status(400).json({ message: "Invoice not found." });
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/invoices/
router.post("/", verifyToken, async (req, res, next) => {
  const {
    owner,
    client,
    items,
    status,
    issuedDate,
    dueDate,
    taxRate,
    taxAmount,
    subTotal,
    total,
    notes,
  } = req.body;

  if (!owner || !client) {
    res
      .status(400)
      .json({ message: "Owner and client informations are required." });
    return;
  }

  if (!owner?.name || !owner?.address) {
    res.status(400).json({ message: "Owner name and address are required." });
    return;
  }

  if (!client?.name || !client?.address) {
    res.status(400).json({ message: "Client name and address are required." });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res
      .status(400)
      .json({ message: "Invoice must contain at least one item." });
    return;
  }

  try {
    // Generate invoice number with the atomic nextInvoiceNumber counter from User model
    const user = await User.findByIdAndUpdate(
      req.payload._id,
      {
        $inc: {
          "invoices.nextInvoiceNumber": 1, // increment by 1 the nextInvoiceNumber counter
        },
      },
      { returnDocument: false }, // Get the number before incrementing
    );
    const { nextInvoiceNumber } = user.invoices;
    const invoiceNumber = `INV-${String(nextInvoiceNumber).padStart(3, "0")}`;
    console.log(invoiceNumber);

    const newInvoice = {
      ownerId: req.payload._id,
      invoiceNumber,
      owner: {
        name: owner.name,
        email: owner.email,
        address: owner.address,
        phone: owner.phone,
      },
      client: {
        name: client.name,
        email: client.email,
        address: client.address,
        phone: client.phone,
      },
      items,
      status,
      issuedDate,
      dueDate,
      taxRate,
      taxAmount,
      subTotal,
      total,
      notes,
    };
    await Invoice.create(newInvoice);

    res.status(201).json({ message: "invoice created." });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/invoices/:invoiceId
router.patch("/:invoiceId", verifyToken, async (req, res, next) => {
  const {
    owner,
    client,
    items,
    issuedDate,
    dueDate,
    taxRate,
    taxAmount,
    subTotal,
    total,
    notes,
  } = req.body;

  if (!owner || !client) {
    res
      .status(400)
      .json({ message: "Owner and client informations are required." });
    return;
  }

  if (!owner?.name || !owner?.address) {
    res.status(400).json({ message: "Owner name and address are required." });
    return;
  }

  if (!client?.name || !client?.address) {
    res.status(400).json({ message: "Client name and address are required." });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res
      .status(400)
      .json({ message: "Invoice must contain at least one item." });
    return;
  }

  try {
    const updatedInvoice = {
      owner: {
        name: owner.name,
        email: owner.email,
        address: owner.address,
        phone: owner.phone,
      },
      client: {
        name: client.name,
        email: client.email,
        address: client.address,
        phone: client.phone,
      },
      items,
      issuedDate,
      dueDate,
      taxRate,
      taxAmount,
      subTotal,
      total,
      notes,
    };
    if (Object.values(updatedInvoice).includes(undefined)) {
      res.status(400).json({ message: "Incorrect request." });
      return;
    }

    const response = await Invoice.findOneAndUpdate(
      { _id: req.params.invoiceId, ownerId: req.payload._id },
      updatedInvoice,
      { returnDocument: true, runValidators: true },
    );
    if (!response) {
      res.status(400).json({ message: "Invoice not found." });
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/invoices/status/:invoiceId
router.patch("/status/:invoiceId", verifyToken, async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ message: "Incorrect request." });
    return;
  }

  try {
    const response = await Invoice.findOneAndUpdate(
      { _id: req.params.invoiceId, ownerId: req.payload._id },
      { status },
      { returnDocument: true, runValidators: true },
    );
    if (!response) {
      res.status(400).json({ message: "Invoice not found." });
      return;
    }

    res.status(200).json({ message: "status updated." });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/invoices/:invoiceId
router.delete("/:invoiceId", verifyToken, async (req, res, next) => {
  try {
    const response = await Invoice.findOneAndDelete({
      _id: req.params.invoiceId,
      ownerId: req.payload._id,
    });
    if (!response) {
      res.status(400).json({ message: "Invoice not found." });
      return;
    }

    res.status(200).json({ message: "invoice deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
