const router = require("express").Router();
const Item = require("../models/Item.model");
const verifyToken = require("../middlewares/auth.middlewares");

// GET /api/items/
router.get("/", verifyToken, async (req, res, next) => {
  try {
    const response = await Item.find({ ownerId: req.payload._id });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/items/
router.post("/", verifyToken, async (req, res, next) => {
  const { title, quantity, tax, unitPrice } = req.body;

  if (!title) {
    res.status(400).json({ message: "Item title is required." });
    return;
  }

  try {
    const newItem = {
      ownerId: req.payload._id,
      title,
      quantity,
      tax,
      unitPrice,
    };
    await Item.create(newItem);

    res.status(201).json({ message: "item created." });
  } catch (error) {
    next(error);
  }
});

// PUT /api/items/:itemId
router.put("/:itemId", verifyToken, async (req, res, next) => {
  const { title, quantity, tax, unitPrice } = req.body;

  if (!title) {
    res.status(400).json({ message: "Item title is required." });
    return;
  }

  try {
    const updatedItem = {
      title,
      quantity,
      tax,
      unitPrice,
    };
    if (Object.values(updatedItem).includes(undefined)) {
      res.status(400).json({ message: "Incorrect request." });
      return;
    }

    const response = await Item.findOneAndUpdate(
      { _id: req.params.itemId, ownerId: req.payload._id },
      updatedItem,
      { returnDocument: true, runValidators: true },
    );
    if (!response) {
      res.status(400).json({ message: "Item not found." });
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/items/:itemId
router.delete("/:itemId", verifyToken, async (req, res, next) => {
  try {
    const response = await Item.findOneAndDelete({
      _id: req.params.itemId,
      ownerId: req.payload._id,
    });
    if (!response) {
      res.status(400).json({ message: "Item not found." });
      return;
    }
    res.status(200).json({ message: "item deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
