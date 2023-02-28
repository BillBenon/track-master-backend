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
    owner: {
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
    countryFlag: {
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
