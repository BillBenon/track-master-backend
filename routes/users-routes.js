const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");
const checkAuth = require("../middlewares/check-auth");
const User = require("../models/user");

const router = express.Router();

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
