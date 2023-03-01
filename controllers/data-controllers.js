const { validationResult } = require("express-validator");
const querystring = require("querystring");
const Data = require("../models/Data");
const HttpError = require("../models/http-error");
const fetch = require("node-fetch");

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
    const data = await Data.findAll();
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

  const {
    IP,
    IPDetails,
    Host,
    Source,
    Domain,
    Brand,
    Country,
    ISP,
    Owner,
    ISPDomain,
    VPN,
    New,
    Archive,
  } = req.body;

  try {
    const data = await fetch(
      `https://restcountries.com/v3.1/name/${Country}?fields=flag,name`
    ).then((data) => data.json());

    let query = {
      access_key: "9869d133b1414a5b015b9cf6048a781a",
      ua: req.headers["user-agent"],
    };
    console.log('starting the fetch...')
    const detect = await fetch(
      `http://api.userstack.com/detect?${querystring.stringify(query)}`
    ).then((res) => res.json());
    console.log(detect)

    const newData = await Data.create({
      IP,
      IPDetails,
      Host: detect.device.type,
      Owner,
      Source,
      Domain,
      Brand: detect.device.brand,
      CountryFlag: data[0].flag,
      Country: data[0].name.common,
      ISP,
      ISPDomain,
      VPN,
      New,
      Archive,
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
