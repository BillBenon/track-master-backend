const express = require("express");
const { body } = require("express-validator");

const detailsControllers = require("../controllers/details-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Details
 *   description: API for managing details.
 * 
 * components:
 *   schemas:
 *     Detail:
 *       type: object
 *       required:
 *         - ID
 *         - IP
 *         - Brand
 *         - Host
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         ID:
 *           type: integer
 *           description: The auto-generated ID of the detail.
 *         IP:
 *           type: string
 *           description: The IP address of the detail.
 *         Brand:
 *           type: string
 *           description: The brand of the detail.
 *         Host:
 *           type: string
 *           description: The host of the detail.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the detail was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the detail was last updated.
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/details/{did}:
 *   get:
 *     summary: Get detail by ID
 *     tags: [Details]
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         description: ID of the detail to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Detail'
 *       404:
 *         description: Detail not found
 * 
 *   delete:
 *     summary: Delete detail by ID
 *     tags: [Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         description: ID of the detail to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Detail deleted
 *       404:
 *         description: Detail not found
 * 
 * /api/details:
 *   get:
 *     summary: Get all details
 *     tags: [Details]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Detail'
 * 
 *   post:
 *     summary: Create a new detail
 *     tags: [Details]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - IP
 *               - Brand
 *               - Host
 *               - createdAt
 *             properties:
 *               IP:
 *                 type: string
 *                 description: The IP address of the detail.
 *               Brand:
 *                 type: string
 *                 description: The brand of the detail.
 *               Host:
 *                 type: string
 *                 description: The host of the detail.
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time the detail was created.
 *            
 *     responses:
 *       "201":
 *         description: A newly created detail object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Detail'
 *       "400":
 *         description: Bad request
 *       "401":
 *         description: Unauthorized
 *       "500":
 *         description: Server error
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
