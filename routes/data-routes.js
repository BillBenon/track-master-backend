const express = require("express");
const { body } = require("express-validator");

const dataControllers = require("../controllers/data-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Data
 *   description: Data endpoint
 *
 * components:
 *   schemas:
 *     Data:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           description: Unique ID for the data
 *         IP:
 *           type: string
 *           description: IP address
 *         IPDetails:
 *           type: string
 *           description: Details about IP address
 *         Host:
 *           type: string
 *           description: Host name
 *         Source:
 *           type: string
 *           description: Source of the data
 *         Domain:
 *           type: string
 *           description: Domain name
 *         Brand:
 *           type: string
 *           description: Brand name
 *         Time:
 *           type: integer
 *           description: Timestamp of the data in Unix epoch format
 *         Country:
 *           type: string
 *           description: Country name
 *         ISP:
 *           type: string
 *           description: Internet Service Provider name
 *         VPN:
 *           type: string
 *           description: Virtual Private Network name
 *         New:
 *           type: integer
 *           description: New data count
 *         Archive:
 *           type: integer
 *           description: Archived data count
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the data creation
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the data update
 *       example:
 *         ID: 1
 *         IP: 192.168.1.1
 *         IPDetails: Some details about the IP
 *         Host: hostname
 *         Source: source name
 *         Domain: domain name
 *         Brand: brand name
 *         Time: 1643195956
 *         Country: country name
 *         ISP: ISP name
 *         VPN: VPN name
 *         New: 10
 *         Archive: 20
 *         created_at: 2022-01-26T08:49:16.000Z
 *         updated_at: 2022-01-26T08:49:16.000Z
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/data/{did}:
 *   get:
 *     summary: Get data by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Data]
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         description: ID of the data to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Data'
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete data by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Data]
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         description: ID of the data to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Data deleted successfully
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal server error
 *
 * /api/data:
 *   post:
 *     tags:
 *       - Data
 *     summary: Create a new data record
 *     description: Create a new data record with the specified data
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Data object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IP:
 *                 type: string
 *                 description: IP address of the data
 *               IPDetails:
 *                 type: string
 *                 description: Details of the IP address
 *               Host:
 *                 type: string
 *                 description: Host name of the data
 *               Source:
 *                 type: string
 *                 description: Source of the data
 *               Domain:
 *                 type: string
 *                 description: Domain name of the data
 *               Brand:
 *                 type: string
 *                 description: Brand of the data
 *               Time:
 *                 type: integer
 *                 description: Time of the data in seconds
 *               Country:
 *                 type: string
 *                 description: Country of the data
 *               ISP:
 *                 type: string
 *                 description: Internet service provider of the data
 *               VPN:
 *                 type: string
 *                 description: Virtual private network of the data
 *               New:
 *                 type: integer
 *                 description: New value of the data
 *               Archive:
 *                 type: integer
 *                 description: Archive value of the data
 *             example:
 *               IP: "192.168.0.1"
 *               IPDetails: "Details of IP address"
 *               Host: "Host name"
 *               Source: "Source name"
 *               Domain: "Domain name"
 *               Brand: "Brand name"
 *               Time: 123456789
 *               Country: "Country name"
 *               ISP: "ISP name"
 *               VPN: "VPN name"
 *               New: 1
 *               Archive: 0
 *     responses:
 *       '201':
 *         description: Data record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Response message
 *                 data:
 *                   type: object
 *                   description: Data object created
 *                   properties:
 *                     ID:
 *                       type: integer
 *                       description: ID of the data record created
 *                     IP:
 *                       type: string
 *                       description: IP address of the data
 *                     IPDetails:
 *                       type: string
 *                       description: Details of the IP address
 *                     Host:
 *                       type: string
 *                       description: Host name of the data
 *                     Source:
 *                       type: string
 *                       description: Source of the data
 *                     Domain:
 *                       type: string
 *                       description: Domain name of the data
 *                     Brand:
 *                       type: string
 *                       description: Brand of the data
 *                     Time:
 *                       type: integer
 *                       description: Time of the data in seconds
 *                     Country:
 *                       type: string
 *                       description: Country of the data
 *                     ISP:
 *                       type: string
 *                       description: Internet service provider of the data
 *                     VPN:
 *                       type: string
 *                       description: Virtual private network of the data
 *                     New:
 *                       type: integer
 *                       description: New value of the data
 *                     Archive:
 *                       type: integer
 *                       description: Archive value of the data
 *               example:
 *                 message: Data record created successfully
 *                 data:
 *                   ID: 1
 *                   IP: "192.168.0.1"
 *                   IPDetails: "Details of IP address"
 *                   Host: "Host name"
 *                   Source: "Source name"
 *                   Domain: "Domain name"
 *                   Brand: "Brand name"
 *                   Time: 123
 *                   Country: "Rwanda"
 *                   ISP: "MTN"
 *                   VPN: "Express VPN"
 *                   New: 1
 *                   Archive: 0
 *   get:
 *     summary: Get all data entries
 *     tags:
 *       - Data
 *     description: Returns a list of all data entries.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of data entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Data'
 *       "400":
 *         description: Bad request
 *       "401":
 *         description: Unauthorized
 *       "500":
 *         description: Server error
 */

router.get("/:did", dataControllers.getDataById);

router.get("/", dataControllers.getData);

router.use(checkAuth);

router.post(
  "/",
  [
    body("Owner").trim().not().isEmpty(),
    body("VPN").trim(),
    body("New").trim().isBoolean(),
    body("Archive").trim().isNumeric(),
    body("latlng").trim().isObject(),
  ],
  dataControllers.createData
);

router.delete("/:did", dataControllers.deleteData);

module.exports = router;
