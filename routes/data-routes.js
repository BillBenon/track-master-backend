const express = require("express");
const { body } = require("express-validator");

const dataControllers = require("../controllers/data-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.get("/:did", dataControllers.getDataById);

router.get("/", dataControllers.getData);

router.use(checkAuth);

router.post(
    "/",
    [
        body("IP").trim().not().isEmpty(),
        body("IPDetails").trim().not().isEmpty(),
        body("Host").trim().not().isEmpty(),
        body("Source").trim().not().isEmpty(),
        body("Domain").trim().not().isEmpty(),
        body("Brand").trim().not().isEmpty(),
        body("Time").trim().isNumeric().not().isEmpty(),
        body("Country").trim().not().isEmpty(),
        body("ISP").trim().not().isEmpty(),
        body("VPN").trim().not().isEmpty(),
        body("New").trim().not().isEmpty().isNumeric(),
        body("Archive").trim().not().isEmpty().isNumeric(),
    ],
    dataControllers.createData
);

router.delete("/:did", dataControllers.deleteData);

module.exports = router;
