const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.Authorization.split(" ")[1];
    console.log(token)
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = await jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.id };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
