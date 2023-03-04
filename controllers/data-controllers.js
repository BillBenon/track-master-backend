const { validationResult } = require("express-validator");
const querystring = require("querystring");
const Data = require("../models/Data");
const HttpError = require("../models/http-error");
const fetch = require("node-fetch");
const sequelize = require("../config/connectionPool");

exports.getDataById = async (req, res, next) => {
  const dataId = req.params.did;

  let data;
  try {
    data = await Data.findByPk(dataId);
    if (!data) {
      throw new Error("Could not find data.");
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find data",
      500
    );
    return next(error);
  }

  res.json({ data: data.toJSON() });
};

exports.getData = async (req, res, next) => {
  try {
    const { page } = req.query;
    console.log(page)
    let limits = {};

    if (page != undefined) {
      const offSet = (page - 1) * 20 || 0;

      limits = {
        limit: 20,
        offset: offSet,
      };
    }

    const users = await Data.findAll({
      attributes: [
        "Country",
        "Owner",
        sequelize.fn("count", sequelize.col("ID")),
      ],
      group: ["Country", "Owner"],
    });

    const countries = await Data.findAll({
      attributes: ["Country"],
      group: ["Country"],
    });

    const data = await Data.findAll({
      where: {},
      ...limits,
    });

    return res.json({
      data,
      nbrCountries: countries.length,
      nbrDataHits: data.length,
      users,
    });
  } catch (err) {
    console.log("The error is: ", err);
    const error = new HttpError(
      "Fetching data failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.createData = async (req, res, next) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { Owner, Archive, latlng } = req.body;

  try {
    let query = {
      access_key: "9869d133b1414a5b015b9cf6048a781a",
      ua: req.headers["user-agent"],
    };

    const detect = await fetch(
      `http://api.userstack.com/detect?${querystring.stringify(query)}`
    )
      .then((res) => res.json())
      .catch((err) => console.log("The error is: ", err));

    const location = await fetch(
      "https://ipgeolocation.abstractapi.com/v1/?api_key=64545adb724a4f19a273263f8ff1c458"
    ).then((res) => res.json());

    const locationToBeStored = {
      longitude: latlng.longitude || location.longitude,
      latitude: latlng.latitude || location.latitude,
    };

    const newData = await Data.create({
      IP: req.connection.remoteAddress,
      IPDetails: `This is an ip address with the request made from ${location.country}`,
      Host: detect.device.type,
      Owner,
      Source: `from latitude: ${
        latlng.latitude || location.latitude
      } and longitude: ${latlng.longitude || location.longitude}`,
      Domain: req.headers.host,
      Brand: detect.device.brand || `Unidentified`,
      CountryFlag: location.flag.emoji,
      Country: location.country,
      ISP: location.connection.isp_name,
      ISPDomain: location.connection.isp_name,
      isVpn: location.security.is_vpn,
      Archive: Archive || `Unidentified`,
      location: JSON.stringify(locationToBeStored),
    });

    return res.status(201).json({
      dataId: newData.ID,
      IP: newData.IP,
      IPDetails: newData.IPDetails,
      Host: newData.Host,
      Source: newData.Source,
      Domain: newData.Domain,
      Brand: newData.Brand,
      Country: newData.Country,
      ISP: newData.ISP,
      CountryFlag: newData.CountryFlag,
      location: JSON.parse(newData.location),
      isVpn: newData.isVpn,
      New: newData.New,
      Archive: newData.Archive,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Registering data failed, please try again",
      500
    );
    return next(error);
  }
};

exports.deleteData = async (req, res, next) => {
  const dataId = req.params.did;

  let data;
  try {
    data = await Data.findByPk(dataId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete data.",
      500
    );
    return next(error);
  }

  if (!data) {
    const error = new HttpError("Could not find this data", 404);
    return next(error);
  }

  try {
    await data.destroy();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete data.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted data." });
};
