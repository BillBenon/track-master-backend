const express = require("express");
const { body } = require("express-validator");

const deviceControllers = require("../controllers/device-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: API for managing devices
 *
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       required:
 *         - ID
 *         - IP
 *         - Name
 *         - User_Agent
 *         - Details
 *         - Details_ipInfo
 *         - created_at
 *       properties:
 *         ID:
 *           type: integer
 *           description: The auto-generated ID of the device
 *         IP:
 *           type: string
 *           description: The IP address of the device
 *         Name:
 *           type: string
 *           description: The name of the device
 *         User_Agent:
 *           type: string
 *           description: The user agent of the device
 *         Details:
 *           type: string
 *           description: Additional details about the device
 *         Details_ipInfo:
 *           type: string
 *           description: Additional IP info about the device
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the device was created
 *       example:
 *         ID: 1
 *         IP: "192.168.1.1"
 *         Name: "Device 1"
 *         User_Agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
 *         Details: "Additional details about Device 1"
 *         Details_ipInfo: "Additional IP info about Device 1"
 *         created_at: "2022-01-01T00:00:00.000Z"
 *
 * /api/device/{did}:
 *   get:
 *     summary: Get a device by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the device to retrieve
 *     responses:
 *       "200":
 *         description: A device object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       "404":
 *         description: The device was not found
 *       "500":
 *         description: Some error occurred while retrieving the device
 *
 *   delete:
 *     summary: Delete a device by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the device to delete
 *     responses:
 *       "200":
 *         description: The device was deleted successfully
 *       "404":
 *         description: The device was not found
 *       "500":
 *         description: Some error occurred while deleting the device
 *
 * /api/device:
 *   get:
 *     summary: Retrieve a list of all devices
 *     security:
 *       - BearerAuth: []
 *     description: Retrieve a list of all devices in the IP database
 *     tags:
 *       - Devices
 *     responses:
 *       200:
 *         description: A list of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *
 *   post:
 *     summary: Create a new device
 *     description: Create a new device in the IP database
 *     tags:
 *       - Devices
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewDevice'
 *     responses:
 *       201:
 *         description: The created device
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized access
 *
 */


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
