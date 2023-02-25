const express = require("express");
const { body } = require("express-validator");

const deviceControllers = require("../controllers/device-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       required:
 *         - IP
 *         - Name
 *         - User_Agent
 *         - Details
 *         - Details_ipInfo
 *         - created_at
 *         - updated_at
 *       properties:
 *         ID:
 *           type: integer
 *           description: The auto-generated id of the device
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
 *           description: Additional details of the device
 *         Details_ipInfo:
 *           type: string
 *           description: IP info details of the device
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the device was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the device was last updated
 *       example:
 *         ID: 1
 *         IP: 192.168.0.1
 *         Name: My Laptop
 *         User_Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299
 *         Details: Additional details of the device
 *         Details_ipInfo: IP info details of the device
 *         created_at: 2022-02-25T08:00:00.000Z
 *         updated_at: 2022-02-25T08:00:00.000Z
 *
 *   parameters:
 *     DeviceId:
 *       name: did
 *       in: path
 *       description: ID of the device to retrieve
 *       required: true
 *       schema:
 *         type: integer
 *
 *   responses:
 *     DeviceResponse:
 *       description: A device object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     DeviceArrayResponse:
 *       description: An array of device objects
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Device'
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/devices/{did}:
 *   get:
 *     summary: Retrieve a single device by ID
 *     tags: [Devices]
 *     parameters:
 *       - $ref: '#/components/parameters/DeviceId'
 *     responses:
 *       '200':
 *         description: A device object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/DeviceResponse'
 *       '404':
 *         description: Device not found
 *
 * /api/devices:
 *   get:
 *     summary: Retrieve a list of all devices
 *     tags: [Devices]
 *     responses:
 *       '200':
 *         description: An array of device objects
 *         content:
 * /api/devices:
 *   get:
 *     summary: Retrieve a list of all devices
 *     description: Retrieve a list of all devices
 *     responses:
 *       200:
 *         description: A list of all devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *
 *   post:
 *     summary: Create a new device
 *     description: Create a new device
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       201:
 *         description: The created device
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntityError'
 *
 * /api/devices/{did}:
 *   get:
 *     summary: Retrieve a device by ID
 *     description: Retrieve a device by ID
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the device to retrieve
 *     responses:
 *       200:
 *         description: The device with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   delete:
 *     summary: Delete a device by ID
 *     description: Delete a device by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the device to delete
 *     responses:
 *       204:
 *         description: The device was deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
