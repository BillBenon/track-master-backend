const Sequelize = require("sequelize");
const sequelize = require("../config/connectionPool");

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
 */

// define data schema
const Data = sequelize.define(
    "Data",
    {
        ID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        IP: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        IPDetails: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Host: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Source: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Domain: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Brand: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Country: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        ISP: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        VPN: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        New: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Archive: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal(
                "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
            ),
            allowNull: false,
        },
    },
    {
        indexes: [
            {
                name: "idx_ip",
                fields: ["IP"],
            },
            {
                name: "idx_ipdetails",
                fields: ["IPDetails"],
            },
            {
                name: "idx_host",
                fields: ["Host"],
            },
            {
                name: "idx_brand",
                fields: ["Brand"],
            },
            {
                name: "idx_country",
                fields: ["Country"],
            },
            {
                name: "idx_isp",
                fields: ["ISP"],
            },
            {
                name: "idx_email",
                fields: ["Domain"],
            },
        ],
    }
);

Data.sync()
    .then(() => {
        console.log("Data table created successfully");
    })
    .catch((error) => {
        console.error("Error creating Data table:", error);
    });

module.exports = Data;
