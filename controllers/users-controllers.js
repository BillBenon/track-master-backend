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
                'Invalid inputs passed, please check your data',
                422
            )
        );
    }

    const { email, password } = req.body;

    let existingUser;
    try {
        [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    } catch (err) {
        const error = new Error(
            'Registering user failed, please try again later.',
            500
        );
        return next(error);
    }

    if (existingUser.length > 0) {
        const error = new Error(
            'User exists already, register another user instead.',
            422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new Error(
            'Could not register user, please try again.',
            500
        );
        return next(error);
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );
        res.status(201).json({ userId: result.insertId, email: email });
    } catch (err) {
        console.log(err);
        const error = new Error(
            'Registering user failed, please try again',
            500
        );
        return next(error);
    }
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Error(errors.array()[0].msg || "Validation failed.", 422));
    }
    const { email, password } = req.body;

    let existingUser;

    try {
        [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    } catch (err) {
        const error = new HttpError(
            "Logging in failed, please try again later.",
            500
        );
        next(error);
    }

    if (!existingUser || existingUser.length === 0) {
        const error = new HttpError(
            "Invalid credentials, could not log you in.",
            403
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser[0].password);
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
                userId: existingUser[0].id,
                email: existingUser[0].email,
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
        userId: existingUser[0].id,
        email: existingUser[0].email,
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
    const { email, password } = req.body;
    const userId = req.params.uid;

    let user;
    try {
        const [rows, fields] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return next(new HttpError("Could not find user.", 404));
        }
        user = rows[0];
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update user.",
            500
        );
        return next(error);
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

    try {
        await db.execute('UPDATE users SET email = ?, password = ? WHERE id = ?', [email, hashedPassword, userId]);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update user.",
            500
        );
        return next(error);
    }

    user.email = email;
    user.password = hashedPassword;

    res.status(200).json({ user });
};
