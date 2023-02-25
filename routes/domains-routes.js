const express = require("express");
const { body } = require("express-validator");

const domainsControllers = require("../controllers/domains-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Domains
 *   description: API for managing domains
 * 
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
 *
 * /api/domains:
 *   get:
 *     summary: Get all domains
 *     security:
 *       - BearerAuth: []
 *     tags: [Domains]
 *     responses:
 *       200:
 *         description: A list of domains
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Domains'
 * 
 *   post:
 *     summary: Create a new domain
 *     security:
 *       - BearerAuth: []
 *     tags: [Domains]
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
 *                 example: example.com
 *               URL:
 *                 type: string
 *                 description: The URL of the domain
 *                 example: https://www.example.com/
 *               Owner:
 *                 type: string
 *                 description: The owner of the domain
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: Domain created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Domains'
 *       400:
 *         description: Invalid input data
 * 
 * /api/domains/{did}:
 *   get:
 *     summary: Get a domain by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Domains]
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: Numeric ID of the domain to get
 *     responses:
 *       200:
 *         description: A domain object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Domains'
 *       404:
 *         description: Domain not found
 * 
 *   delete:
 *     summary: Delete domain by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Domains]
 *     description: Deletes a single domain
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the domain to delete
 *     responses:
 *       204:
 *         description: Domain successfully deleted
 *       404:
 *         description: Domain not found
 * 
 *   patch:
 *     summary: Update a domain by ID
 *     tags: [Domains]
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: Numeric ID of the domain to update
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Domain:
 *                 type: string
 *                 description: The name of the domain.
 *               URL:
 *                 type: string
 *                 description: The URL of the domain.
 *             example:
 *               Domain: example.com
 *               URL: https://www.example.com/
 *     responses:
 *       '200':
 *         description: A domain object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Domains'
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized access
 *       '404':
 *         description: Domain not found
 */


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
