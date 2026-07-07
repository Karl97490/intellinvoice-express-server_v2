const router = require("express").Router();

// Test Route
router.get("/", async (req, res, next) => {
  res.status(200).json({ message: "GET /api, all good here." });
});

// Authentification Routes
const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

// Users Routes
const userRouter = require("./users.routes");
router.use("/users", userRouter);

// Invoices Routes
const invoiceRouter = require("./invoices.routes");
router.use("/invoices", invoiceRouter);

// Clients Routes
const clientRouter = require("./clients.routes");
router.use("/clients", clientRouter);

// Items Routes
const itemRouter = require("./items.routes");
router.use("/items", itemRouter);

module.exports = router;
