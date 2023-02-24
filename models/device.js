const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectionPool');

// define device model
const Device = sequelize.define('IP_Database', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    IP: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    User_Agent: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Details: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Details_ipInfo: {
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
            unique: false,
            fields: ['User_Agent']
        }
    ],
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// create table if not exists
Device.sync().then(() => {
    console.log('Device table created successfully');
}).catch((err) => {
    console.error('Error creating device table:', err);
});

module.exports = Device;
