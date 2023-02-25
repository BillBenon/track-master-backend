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
 *       properties:
 *         ID:
 *           type: integer
 *           format: int64
 *           description: The auto-generated id of the device.
 *         IP:
 *           type: string
 *           description: The IP address of the device.
 *         Name:
 *           type: string
 *           description: The name of the device.
 *         User_Agent:
 *           type: string
 *           description: The user agent of the device.
 *         Details:
 *           type: object
 *           description: Additional details about the device.
 *         Details_ipInfo:
 *           type: object
 *           description: Additional details about the device's IP address.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the device was created.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the device was last updated.
 *       required:
 *         - IP
 *         - Name
 *         - User_Agent
 *         - Details
 *         - Details_ipInfo
 *         - created_at
 *         - updated_at
 *       example:
 *         ID: 1
 *         IP: 192.168.1.1
 *         Name: My Laptop
 *         User_Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36
 *         Details: { "OS": "Windows 10", "RAM": "8 GB" }
 *         Details_ipInfo: { "City": "New York", "Country": "United States" }
 *         created_at: '2022-02-20T14:15:00.000Z'
 *         updated_at: '2022-02-22T08:30:00.000Z'
 *
 * /api/devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Devices]
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
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IP:
 *                 type: string
 *                 description: The IP address of the device.
 *                 example: 192.168.1.1
 *               Name:
 *                 type: string
 *                 description: The name of the device.
 *                 example: My Laptop
 *               User_Agent:
 *                 type: string
 *                 description: The user agent of the device.
 *                 example: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36
 *               Details:
 *                 type: object
 *                 description: Additional details about the device.
 *               Details
 *               Details_ipInfo:
 *                 type: string
 *                 description: IP info details of the device
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: The date the device was created
 *               updated_at:
 *                 type: string
 *                 format: date-time
 *                 description: The date the device was last updated
 *     responses:
 *       201:
 *         description: Device created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Invalid input data
 * /api/devices/{did}:
 *   get:
 *     summary: Get a device by ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: Numeric ID of the device to get
 *     responses:
 *       200:
 *         description: A device object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: Device not found
 * 
 *   delete:
 *     summary: Delete a device by ID
 *     tags: [Devices]
 *     description: Deletes a single device
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: ID of the device to delete
 *     responses:
 *       204:
 *         description: Device successfully deleted
 *       404:
 *         description: Device not found
 * 
 *   patch:
 *     summary: Update a device by ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: Numeric ID of the device to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       '200':
 *         description: A device object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       '400':
 *         description: Invalid input data
 *       '404':
 *         description: Device not found
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
