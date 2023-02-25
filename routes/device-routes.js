const express = require("express");
const { body } = require("express-validator");

const deviceControllers = require("../controllers/device-controllers");

const router = express.Router();

router.get("/:did", deviceControllers.getDeviceById);

router.get("/", deviceControllers.getDevices);

router.use(checkAuth);

router.post(
    "/",
    [
        body("IP").trim().not().isEmpty(),
        body("Name").trim().not().isEmpty(),
        body("User_Agent").trim().not().isEmpty(),
        body("Details").trim().not().isEmpty(),
        body("Details_ipInfo").trim().not().isEmpty(),
        body("createdAt").trim().isNumeric().not().isEmpty(),
    ],
    deviceControllers.createDevice
);

router.delete("/:did", deviceControllers.deleteDevice);

module.exports = router;
