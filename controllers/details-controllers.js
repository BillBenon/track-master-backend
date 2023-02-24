const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Details = require("../models/details");

exports.getDetailById = async (req, res, next) => {
    const detailId = req.params.did;

    let detail;
    try {
        detail = await Detail.findByPk(detailId);
        if (!detail) {
            throw new Error("Could not find detail.");
        }
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find detail",
            500
        );
        return next(error);
    }

    res.json({ detail: detail.toJSON() });
};

exports.getDetails = async (req, res, next) => {
    try {
        const details = await Detail.findAll();
        res.json({ details });
    } catch (err) {
        console.log(err);
        const error = new HttpError("Fetching details failed, please try again later.", 500);
        return next(error);
    }
};

exports.createDetail = async (req, res, next) => {
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

    const { IP, Brand, Host, createdAt } = req.body;

    try {

        const newDetail = await Details.create({ IP, Brand, Host, createdAt });
        res.status(201).json({ detailId: newDetail.ID, Brand: newDetail.Brand, Host: newDetail.Host, createdAt: newDetail.createdAt });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Registering detail failed, please try again',
            500
        );
        return next(error);
    }
};

exports.deleteDetail = async (req, res, next) => {
    const detailId = req.params.did;

    let detail;
    try {
        detail = await Details.findByPk(detailId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete detail.",
            500
        );
        return next(error);
    }

    if (!detail) {
        const error = new HttpError("Could not find this detail", 404);
        return next(error);
    }

    try {
        await detail.destroy();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete detail.",
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "Deleted detail." });
};