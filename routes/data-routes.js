const express = require("express");
const { body } = require("express-validator");

const dataControllers = require("../controllers/data-controllers");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Data:
 *       type: object
 *       required:
 *         - ID
 *         - IP
 *         - IPDetails
 *         - Host
 *         - Source
 *         - Domain
 *         - Brand
 *         - Country
 *         - ISP
 *         - VPN
 *         - New
 *         - Archive
 *         - created_at
 *         - updated_at
 *       properties:
 *         ID:
 *           type: integer
 *           format: int64
 *           description: The auto-generated ID of the data
 *         IP:
 *           type: string
 *           description: The IP address
 *         IPDetails:
 *           type: string
 *           description: Details of the IP address
 *         Host:
 *           type: string
 *           description: The host name
 *         Source:
 *           type: string
 *           description: The source
 *         Domain:
 *           type: string
 *           description: The domain
 *         Brand:
 *           type: string
 *           description: The brand
 *         Country:
 *           type: string
 *           description: The country
 *         ISP:
 *           type: string
 *           description: The ISP
 *         VPN:
 *           type: string
 *           description: The VPN
 *         New:
 *           type: integer
 *           format: int32
 *           description: The new value
 *         Archive:
 *           type: integer
 *           format: int32
 *           description: The archive value
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the data was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the data was last updated
 *       example:
 *         ID: 1
 *         IP: 192.168.1.1
 *         IPDetails: Details of the IP address
 *         Host: example.com
 *         Source: Source of the data
 *         Domain: example.com
 *         Brand: Brand name
 *         Country: Country name
 *         ISP: ISP name
 *         VPN: VPN name
 *         New: 1
 *         Archive: 0
 *         created_at: 2023-02-25T00:00:00.000Z
 *         updated_at: 2023-02-25T00:00:00.000Z
 *
 * /data/{did}:
 *   get:
 *     summary: Get data by ID
 *     description: Retrieve data from the database by ID
 *     parameters:
 *       - in: path
 *         name: did
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: Numeric ID of the data to get
 *     responses:
 *       200:
 *         description: The data with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Data'
 *       404:
 *         description: The data with the specified ID was not found
 *
 *   delete:
 *     summary: Delete data by ID
 *     description: Delete data by providing data ID in the URL
 *     tags:
 *       - Data
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the data to delete
 *         description: Numeric ID of the data to delete
 *     responses:
 *       '200':
 *         description: Data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating data was deleted successfully
 *                   example: Data deleted successfully
 *       '404':
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/data:
 *   get:
 *     summary: Get all data
 *     description: Retrieve all data from the database
 *     tags:
 *       - Data
 *     responses:
 *       '200':
 *         description: A list of data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Data'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 * /api/data:
 *   post:
 *     summary: Create a new data
 *     security:
 *       - BearerAuth: []
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IP:
 *                 type: string
 *                 description: The IP address
 *               IPDetails:
 *                 type: string
 *                 description: Details of the IP address
 *               Host:
 *                 type: string
 *                 description: The host name
 *               Source:
 *                 type: string
 *                 description: The source
 *               Domain:
 *                 type: string
 *                 description: The domain
 *               Brand:
 *                 type: string
 *                 description: The brand
 *               Time:
 *                 type: integer
 *                 description: The time
 *               Country:
 *                 type: string
 *                 description: The country
 *               ISP:
 *                 type: string
 *                 description: The ISP
 *               VPN:
 *                 type: string
 *                 description: The VPN
 *               New:
 *                 type: integer
 *                 description: The new value
 *               Archive:
 *                 type: integer
 *                 description: The archive value
 *             example:
 *               IP: 192.168.1.1
 *               IPDetails: Details of the IP address
 *               Host: example.com
 *               Source: Source of the data
 *               Domain: example.com
 *               Brand: Brand name
 *               Time: 123456
 *               Country: Country name
 *               ISP: ISP name
 *               VPN: VPN name
 *               New: 1
 *               Archive: 0
 *     responses:
 *       201:
 *         description: Data created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Data'
 *       422:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HttpError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HttpError'
 */

router.get("/:did", dataControllers.getDataById);

router.get("/", dataControllers.getData);

router.use(checkAuth);

router.post(
    "/",
    [
        body("IP").trim().not().isEmpty(),
        body("IPDetails").trim().not().isEmpty(),
        body("Host").trim().not().isEmpty(),
        body("Source").trim().not().isEmpty(),
        body("Domain").trim().not().isEmpty(),
        body("Brand").trim().not().isEmpty(),
        body("Time").trim().isNumeric().not().isEmpty(),
        body("Country").trim().not().isEmpty(),
        body("ISP").trim().not().isEmpty(),
        body("VPN").trim().not().isEmpty(),
        body("New").trim().not().isEmpty().isNumeric(),
        body("Archive").trim().not().isEmpty().isNumeric(),
    ],
    dataControllers.createData
);

router.delete("/:did", dataControllers.deleteData);

module.exports = router;
