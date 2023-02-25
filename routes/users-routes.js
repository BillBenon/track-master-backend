const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");
const checkAuth = require("../middlewares/check-auth");
const User = require("../models/user");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         id: 1
 *         email: john.doe@example.com
 *         password: abc123
 *
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: abc123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Invalid email or password
 *
 * /api/users/signup:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: abc123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email address already exists
 *
 * /api/users/{uid}:
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: abc123
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 */

router.post(
    "/login",
    [
        check("email").exists()
            .normalizeEmail()
            .withMessage("Please enter a valid email."),
        check("password", "Password has to be atleast 8 alphanumeric characters.")
            .trim()
            .isLength({ min: 8 }),
        // .isStrongPassword(),
    ],
    usersControllers.login
);


router.post(
    "/signup",
    [
        check("email").exists()
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject("Email address already exists!");
                    }
                });
            })
            .normalizeEmail(),
        check("password", "Password has to be atleast 8 alphanumeric characters")
            .isLength({ min: 8 })
        //   .isStrongPassword(),
    ],
    usersControllers.signUp
);

router.patch(
    "/:uid",
    [checkAuth],
    [
        check("email").exists()
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject("Email address already exists!");
                    }
                });
            })
            .normalizeEmail(),
        check("password", "Password has to be atleast 8 alphanumeric characters")
            .isLength({ min: 8 })
        // .isStrongPassword(),
    ],
    usersControllers.updateUser
);

module.exports = router;