const express = require("express");
const { body } = require("express-validator");

const domainsControllers = require("../controllers/domains-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Domains:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           format: int64
 *           description: The ID of the domain.
 *         Domain:
 *           type: string
 *           description: The name of the domain.
 *         URL:
 *           type: string
 *           description: The URL of the domain.
 *         Owner:
 *           type: string
 *           description: The owner of the domain.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the domain was created.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the domain was last updated.
 *       required:
 *         - Domain
 *         - URL
 *         - Owner
 *       example:
 *         ID: 1
 *         Domain: example.com
 *         URL: https://www.example.com/
 *         Owner: John Doe
 *         created_at: '2022-02-20T14:15:00.000Z'
 *         updated_at: '2022-02-22T08:30:00.000Z'
 */

/**
 * @swagger
 * /api/domains/{did}:
 *   get:
 *     summary: Get a domain by ID
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: Numeric ID of the domain to get
 *     responses:
 *       '200':
 *         description: A domain object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Domains'
 *
 *   delete:
 *     summary: Delete a domain by ID
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: Numeric ID of the domain to delete
 *     responses:
 *       '204':
 *         description: No content
 *
 * /api/domains:
 *   get:
 *     summary: Get a list of all domains
 *     responses:
 *       '200':
 *         description: A list of domain objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Domains'
 *
 *   post:
 *     summary: Create a new domain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Domain:
 *                 type: string
 *                 description: The name of the domain
 *               URL:
 *                 type: string
 *                 description: The URL of the domain
 *               Owner:
 *                 type: string
 *                 description: The owner of the domain
 *             required:
 *               - Domain
 *               - URL
 *               - Owner
 *             example:
 *               Domain: example.com
 *               URL: https://www.example.com/
 *               Owner: John Doe
 *     responses:
 *       201:
 *         description: The created domain.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Domains'
 *       422:
 *         description: Invalid input data.
 *
 * */

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
