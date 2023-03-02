const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const HttpError = require("../models/http-error");

exports.getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("Could not find user.");
    }

    res.json({ user });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user",
      500
    );
    return next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json({ users });
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        errors.array()[0].msg ||
          "Invalid inputs passed, please check your data",
        422
      )
    );
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ where: { email: email } });
  } catch (err) {
    const error = new HttpError(
      "Registering user failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, register another user instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not register user, please try again.",
      500
    );
    return next(error);
  }

  const user = new User({
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Registering user failed, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({ email: user.email });
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(errors.array()[0].msg || "Validation failed.", 422)
    );
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ where: { email: email } });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Could not log you in, please try again.", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "20d" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
  });
};

exports.updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        errors.array()[0].msg ||
          "Invalid inputs passed, please check your data.",
        422
      )
    );
  }

  const { email, password, currentPassword } = req.body;
  const userId = req.params.uid;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return next(new HttpError("Could not find user.", 404));
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (isValid) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.email = email;
      user.password = hashedPassword;
      await user.save();
      return res.status(200).json({ user: user });
    }

    return next(new HttpError("Invalid credentials.", 403));
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user!",
      500
    );
    return next(error);
  }
};
