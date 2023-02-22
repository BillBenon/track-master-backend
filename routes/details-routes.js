const express = require("express");
const { body } = require("express-validator");

const detailsControllers = require("../controllers/details-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.get("/:did", detailsControllers.getDetailsById);

router.get("/", detailsControllers.getDetails);

router.use(checkAuth);

router.post(
    "/",
    [
        body("ID").trim().isNumeric().not().isEmpty(),
        body("IP").trim().isNumeric().not().isEmpty(),
        body("Brand").trim().not().isEmpty(),
        body("Host").trim().not().isEmpty(),
        body("Time").trim().isNumeric().not().isEmpty(),
    ],
    detailsControllers.createDetails
);

router.delete("/:bid", detailsControllers.deleteDetails);

module.exports = router;
