const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Device = require("../models/device");

exports.getDeviceById = async (req, res, next) => {
    const deviceId = req.params.did;

    let device;
    try {
        device = await Device.findByPk(deviceId);
        if (!device) {
            throw new Error("Could not find device.");
        }
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find device",
            500
        );
        return next(error);
    }

    res.json({ device: device.toJSON() });
};

exports.getDevices = async (req, res, next) => {
    try {
        const devices = await Device.findAll();
        res.json({ devices });
    } catch (err) {
        console.log(err);
        const error = new HttpError("Fetching devices failed, please try again later.", 500);
        return next(error);
    }
};

exports.createDevice = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError(
                errors.array()[0].msg ||
                'Invalid inputs passed, please check your data',
                422
            )
        );
    }

    const { IP, Name, User_Agent, Details, Details_ipInfo, createdAt } = req.body;

    try {

        const newDevice = await Device.create({ IP, Name, User_Agent, Details, Details_ipInfo, createdAt });
        res.status(201).json({ deviceId: newDevice.ID, IP: newDevice.IP, Name: newDevice.Name, User_Agent: newDevice.User_Agent, Details: newDevice.Details, Details_ipInfo: newDevice.Details_ipInfo, createdAt: newDevice.createdAt });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Registering device failed, please try again',
            500
        );
        return next(error);
    }
};

exports.deleteDevice = async (req, res, next) => {
    const deviceId = req.params.did;

    let device;
    try {
        device = await Device.findByPk(deviceId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete device.",
            500
        );
        return next(error);
    }

    if (!device) {
        const error = new HttpError("Could not find this device", 404);
        return next(error);
    }

    try {
        await device.destroy();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete device.",
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "Deleted device." });
};