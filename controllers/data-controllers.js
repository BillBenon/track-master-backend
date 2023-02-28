const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Data = require("../models/Data");

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
    console.log(err);
    const error = new HttpError(
      "Fetching data failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.createData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        errors.array()[0].msg ||
          "Invalid inputs passed, please check your data",
        422
      )
    );
  }

  const {
    IP,
    IPDetails,
    Host,
    Source,
    Domain,
    Brand,
    Time,
    Country,
    ISP,
    VPN,
    New,
    Archive,
    owner,
    ISPDomain,
  } = req.body;

  try {
    const data = await fetch(
      `https://restcountries.com/v3.1/name/${Country}?fields=flag,name`
    ).then((data) => data.json());

    const newData = await Data.create({
      IP,
      IPDetails,
      Host,
      owner,
      Source,
      Domain,
      Brand,
      Time,
      flag: data.flag,
      Country: data.name.common,
      ISP,
      VPN,
      New,
      Archive,
    });
    res
      .status(201)
      .json({
        dataId: newData.ID,
        IP: newData.IP,
        IPDetails: newData.IPDetails,
        Host: newData.Host,
        Source: newData.Source,
        Domain: newData.Domain,
        Brand: newData.Brand,
        Time: newData.Time,
        Country: newData.Country,
        ISP: newData.ISP,
        VPN: newData.VPN,
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
