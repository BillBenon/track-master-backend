const express = require("express");
const { body } = require("express-validator");

const detailsControllers = require("../controllers/details-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.get("/:did", detailsControllers.getDetailById);

router.get("/", detailsControllers.getDetails);

router.use(checkAuth);

router.post(
    "/",
    [
        body("IP").trim().not().isEmpty(),
        body("Brand").trim().not().isEmpty(),
        body("Host").trim().not().isEmpty(),
        body("createdAt").trim().isNumeric().not().isEmpty(),
    ],
    detailsControllers.createDetail
);

router.delete("/:did", detailsControllers.deleteDetail);

module.exports = router;
