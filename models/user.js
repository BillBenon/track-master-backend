const { Sequelize } = require("sequelize");
const sequelize = require("../config/connectionPool");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         id: 1
 *         email: john.doe@example.com
 *         password: abc123
 */

// define user model
const User = sequelize.define("users", {
    email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
});

// sync user model with database
(async () => {
    try {
        await User.sync();
        console.log("Users table created successfully");
    } catch (err) {
        console.error("Error syncing Users table:", err);
    }
})();

module.exports = User;
