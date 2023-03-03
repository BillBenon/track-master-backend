const { validationResult } = require("express-validator");
const querystring = require("querystring");
const Data = require("../models/Data");
const HttpError = require("../models/http-error");
const fetch = require("node-fetch");
const { METHODS } = require("http");

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

    const offSet = (page - 1) * 20 || 0;

    const data = await Data.findAll({
      where: {},
      limit: 20,
      offset: offSet,
    });
    res.json({ data });
  } catch (err) {
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

  const { Owner, VPN, New, Archive, latlng } = req.body;

  try {
    const location = await fetch(
      "https://ipgeolocation.abstractapi.com/v1/?api_key=64545adb724a4f19a273263f8ff1c458"
    ).then((res) => res.json());

    let query = {
      access_key: "9869d133b1414a5b015b9cf6048a781a",
      ua: req.headers["user-agent"],
    };

    const detect = await fetch(
      `http://api.userstack.com/detect?${querystring.stringify(query)}`
    ).then((res) => res.json());

    const newData = await Data.create({
      IP: location.ip_adress,
      IPDetails: `This is an ip address with the request made from ${location.country}`,
      Host: detect.device.type,
      Owner,
      Source: `from latitude: ${
        latlng[0] || location.latitude
      } and longitude: ${latlng[1] || location.longitude}`,
      Domain: req.headers.host,
      Brand: detect.device.brand,
      CountryFlag: location.flag.emoji,
      Country: location.country,
      ISP: location.isp_name,
      ISPDomain: location.isp_name,
      VPN,
      New,
      Archive,
    });
    console.log(newData);

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
