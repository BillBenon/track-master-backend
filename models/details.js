const { DataTypes } = require("sequelize");
const sequelize = require("../config/connectionPool");

// define details model
const Details = sequelize.define("details", {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    IP: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Brand: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Host: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
});

// sync model with database
Details.sync()
    .then(() => console.log("Details table created successfully"))
    .catch((err) => console.error(err));

module.exports = Details;
