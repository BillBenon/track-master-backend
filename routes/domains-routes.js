const express = require("express");
const { body } = require("express-validator");

const domainsControllers = require("../controllers/domains-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.get("/:did", domainsControllers.getDomainById);

router.get("/", domainsControllers.getDomains);

router.use(checkAuth);

router.post(
    "/",
    [
        body("Domain").trim().not().isEmpty(),
        body("URL").trim().not().isEmpty(),
        body("Owner").trim().not().isEmpty(),
    ],
    domainsControllers.createDomain
);

router.delete("/:did", domainsControllers.deleteDomain);

module.exports = router;
