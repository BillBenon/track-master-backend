const fs = require("fs");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

import { pool } from "../config/connectionPool";
const HttpError = require("../models/http-error");
const User = require("../models/user");

exports.getUserById = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
        connection.release();

        if (rows.length === 0) {
            throw new Error('Could not find user.');
        }

        user = rows[0];
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find user",
            500
        );
        return next(error);
    }

    res.json({ user });
};

exports.getUsers = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows, fields] = await connection.execute("SELECT * FROM users");
        const users = rows.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.json({ users });
    } catch (err) {
        console.log(err);
        const error = new HttpError('Fetching users failed, please try again later.', 500);
        return next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new Error(
                errors.array()[0].msg ||
                "Invalid inputs passed, please check your data",
                422
            )
        );
    }

    const {
        fullnames,
        username,
        email,
        gender,
        residence,
        phone,
        password,
        role,
    } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
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

    const createdUser = new User({
        fullnames,
        username,
        email,
        gender,
        residence,
        phone,
        role,
        image: req.file.path,
        password: hashedPassword,
        blogs: [],
    });

    try {
        await createdUser.save().then(() => {
            group
                .find({ group_name: req.body.role })
                .then((group1) => {
                    if (group1.length == 0) {
                        let createGroup = new group({
                            group_name: req.body.role,
                            members: createdUser.id,
                        });
                        createGroup
                            .save()
                            .then((info) => {
                                return res
                                    .statu(201)
                                    .json({ userId: createdUser.id, email: createdUser.email });
                            })
                            .catch((err) => {
                                return next(
                                    new HttpError(
                                        "Creating new user group failed, try again!",
                                        500
                                    )
                                );
                            });
                    } else {
                        group
                            .findOneAndUpdate(
                                { group_name: req.body.role },
                                {
                                    $push: { members: createdUser.id },
                                }
                            )
                            .then(() => {
                                return res
                                    .status(201)
                                    .json({ userId: createdUser.id, email: createdUser.email });
                            })
                            .catch((err) => {
                                return next(
                                    new HttpError(
                                        `Putting user in ${req.body.role}'s group failed, try again!`,
                                        500
                                    )
                                );
                            });
                    }
                })
                .catch((err) => {
                    const error = new HttpError(
                        "Creating user group failed, try again!",
                        500
                    );
                    return next(error);
                });
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            "Registering user failed, please try again",
            500
        );
        return next(error);
    }
    // res.status(201).json({ userId: createdUser.id, email: createdUser.email });
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Error(errors.array()[0].msg || "Validation failed.", 422));
    }
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
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
                userId: existingUser._id,
                email: existingUser.email,
                role: existingUser.role,
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
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
    const {
        fullnames,
        username,
        email,
        gender,
        residence,
        phoneNumber,
        password,
        role,
    } = req.body;
    let imagePath = req.body.image;
    const userId = req.params.uid;

    if (req.file) {
        imagePath = req.file.path.replace("\\", "/");
    }

    if (!imagePath) {
        return next(new HttpError("No image picked.", 422));
    }

    let user;
    try {
        user = await User.findById(userId);
        if (!user) {
            return next(new HttpError("Could not find user.", 404));
        }
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update user.",
            500
        );
        return next(error);
    }
    if (imagePath !== user.image) {
        fs.unlink(user.image, (err) => {
            console.log(err);
        });
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            "Could not update user, please try again.",
            500
        );
        return next(error);
    }

    user.fullnames = fullnames;
    user.username = username;
    user.email = email;
    user.gender = gender;
    user.residence = residence;
    user.phoneNumber = phoneNumber;
    user.password = hashedPassword;
    user.role = role;
    user.image = imagePath;

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update user.",
            500
        );
        return next(error);
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.params.pid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete user.",
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError("Could not find user for this id", 404);
        return next(error);
    }

    if (user.role == "superadmin") {
        const error = new HttpError(
            "You're not allowed to perform this action.",
            403
        );
        return next(error);
    }

    const imagePath = user.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await user.remove({ session: sess });
        await user.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete user.",
            500
        );
        return next(error);
    }

    fs.unlink(imagePath, (err) => {
        console.log(err);
    });

    res.status(200).json({ message: "Deleted user." });
};
