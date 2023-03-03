const Sequelize = require("sequelize");
const sequelize = require("../config/connectionPool");

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
    Owner: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Brand: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    CountryFlag: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ISP: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ISPDomain: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isVpn: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    New: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    Archive: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
        name: "idx_domain",
        fields: ["Domain"],
      },
      {
        name: "idx_owner",
        fields: ["Owner"],
      },
      {
        name: "idx_countryFlag",
        fields: ["CountryFlag"],
      },
      {
        name: "idx_location",
        fields: ["Location"],
      },
    ],
  }
);

Data.sync({ alter: true })
  .then(() => {
    console.log("Data table created successfully");
  })
  .catch((error) => {
    console.error("Error creating Data table:", error);
  });

module.exports = Data;
