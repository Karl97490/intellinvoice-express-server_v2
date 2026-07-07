const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // console.log(req.headers);
  try {
    const authToken = req.headers.authorization.split(" ")[1];
    // console.log(authToken);
    const payload = jwt.verify(authToken, process.env.TOKEN_SECRET);
    // console.log(payload);
    req.payload = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid or does not exists." });
  }
};

module.exports = verifyToken;
