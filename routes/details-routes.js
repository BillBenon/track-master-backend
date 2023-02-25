const express = require("express");
const { body } = require("express-validator");

const detailsControllers = require("../controllers/details-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Details:
 *       type: object
 *       required:
 *         - IP
 *         - Brand
 *         - Host
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         ID:
 *           type: integer
 *           description: The auto-generated ID of the details
 *         IP:
 *           type: string
 *           description: The IP address
 *         Brand:
 *           type: string
 *           description: The brand
 *         Host:
 *           type: string
 *           description: The host name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the details were created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the details were last updated
 *       example:
 *         ID: 1
 *         IP: 127.0.0.1
 *         Brand: ACME Corporation
 *         Host: example.com
 *         createdAt: 2023-02-25T11:23:45.000Z
 *         updatedAt: 2023-02-25T11:23:45.000Z
 *
 * /details/{did}:
 *   get:
 *     summary: Get a single detail by ID
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         description: Numeric ID of the detail to get
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details found and returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Details'
 *       404:
 *         description: Details not found for the given ID
 *
 * /details:
 *   get:
 *     summary: Get a list of all details
 *     responses:
 *       200:
 *         description: A list of details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Details'
 *
 *   post:
 *     summary: Create a new detail
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Details'
 *     responses:
 *       201:
 *         description: Details created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Details'
 *       400:
 *         description: Invalid request body
 *
 * /details/{did}:
 *   delete:
 *     summary: Delete a single detail by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         description: Numeric ID of the detail to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details deleted successfully
 *       404:
 *         description: Details not found for the given ID
 */

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
