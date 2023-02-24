const { Sequelize } = require('sequelize');
const sequelize = require("../config/connectionPool");

// define user model
const User = sequelize.define('users', {
    email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    }
});

// sync user model with database
(async () => {
    try {
        await User.sync();
        console.log('Users table created successfully');
    } catch (err) {
        console.error('Error syncing Users table:', err);
    }
})();

module.exports = User;
