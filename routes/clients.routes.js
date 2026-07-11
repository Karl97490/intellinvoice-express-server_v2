const router = require("express").Router();
const Client = require("../models/Client.model");
const verifyToken = require("../middlewares/auth.middlewares");

// GET /api/clients/
router.get("/", verifyToken, async (req, res, next) => {
  try {
    const response = await Client.find({ ownerId: req.payload._id });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/clients/:clientId
router.get("/:clientId", verifyToken, async (req, res, next) => {
  try {
    const response = await Client.findOne({
      _id: req.params.clientId,
      ownerId: req.payload._id,
    });
    if (!response) {
      res.status(400).json({ message: "Client not found." });
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/clients/
router.post("/", verifyToken, async (req, res, next) => {
  const { name, email, address, phone } = req.body;

  if (!name || !address) {
    res.status(400).json({ message: "Name and address are required." });
    return;
  }

  const nameRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  if (!nameRegex.test(name)) {
    res.status(400).json({ message: "Name is incorrect." });
    return;
  }

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (!emailRegex.test(email) && email) {
    res.status(400).json({ message: "Email is incorrect." });
    return;
  }

  const validatePhone = phone?.replace(/\D/g, "");
  if (validatePhone?.length < 7 || (validatePhone?.length > 15 && phone)) {
    res.status(400).json({ message: "Phone number is incorrect." });
    return;
  }

  try {
    const newClient = {
      ownerId: req.payload._id,
      name,
      email,
      address,
      phone,
    };
    await Client.create(newClient);

    res.status(201).json({ message: "client created." });
  } catch (error) {
    next(error);
  }
});

// PUT /api/clients/:clientId
router.put("/:clientId", verifyToken, async (req, res, next) => {
  const { name, email, address, phone } = req.body;

  if (!name || !address) {
    res.status(400).json({ message: "Name and address are required." });
    return;
  }

  const nameRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  if (!nameRegex.test(name)) {
    res.status(400).json({ message: "Name is incorrect." });
    return;
  }

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (!emailRegex.test(email) && email) {
    res.status(400).json({ message: "Email is incorrect." });
    return;
  }

  const validatePhone = phone?.replace(/\D/g, "");
  if ((validatePhone?.length < 7 || validatePhone?.length > 15) && phone) {
    res.status(400).json({ message: "Phone number is incorrect. " });
    return;
  }

  try {
    const updatedClient = {
      name,
      email,
      phone,
      address,
    };
    if (Object.values(updatedClient).includes(undefined)) {
      res.status(400).json({ message: "Invalid request payload." });
      return;
    }

    const response = await Client.findOneAndUpdate(
      { _id: req.params.clientId, ownerId: req.payload._id },
      updatedClient,
      { returnDocument: true, runValidators: true },
    );
    if (!response) {
      res.status(400).json({ message: "Client not found." });
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/clients/:clientId
router.delete("/:clientId", verifyToken, async (req, res, next) => {
  try {
    const response = await Client.findOneAndDelete({
      _id: req.params.clientId,
      ownerId: req.payload._id,
    });
    if (!response) {
      res.status(400).json({ message: "Client not found." });
      return;
    }
    res.status(200).json({ message: "client deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
