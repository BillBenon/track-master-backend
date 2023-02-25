const { DataTypes } = require("sequelize");
const sequelize = require("../config/connectionPool");

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

const Domains = sequelize.define(
    "Domains",
    {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        Domain: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        URL: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        Owner: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
    },
    {
        indexes: [
            {
                name: "idx_url",
                fields: ["URL"],
            },
            {
                name: "idx_owner",
                fields: ["Owner"],
            },
        ],
    }
);

module.exports = Domains;
