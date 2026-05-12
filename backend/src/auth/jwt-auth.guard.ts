const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader =
      req.headers.authorization;

    console.log(
      "AUTH HEADER:",
      authHeader
    );

    if (!authHeader) {
      return res
        .status(401)
        .json({
          error: "Token mancante",
        });
    }

    const token =
      authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "DECODED:",
      decoded
    );

    req.user = decoded;

    next();
  } catch (err) {
    console.log(
      "JWT ERROR:",
      err
    );

    return res
      .status(401)
      .json({
        error: "Token non valido",
      });
  }
};