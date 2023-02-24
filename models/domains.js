const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionPool');

const Domains = sequelize.define('Domains', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Domain: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    URL: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    Owner: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    indexes: [
        {
            name: 'idx_url',
            fields: ['URL']
        },
        {
            name: 'idx_owner',
            fields: ['Owner']
        }
    ]
});

module.exports = Domains;
