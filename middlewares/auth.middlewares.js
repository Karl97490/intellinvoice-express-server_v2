const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authToken = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(authToken, process.env.TOKEN_SECRET);
    req.payload = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid or does not exists." });
  }
};

module.exports = verifyToken;
