const fs = require("fs");

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Domains = require("../models/domains");

exports.getDomainById = async (req, res, next) => {
    const domainId = req.params.did;

    let domain;
    try {
        domain = await Domain.findByPk(domainId);
        if (!domain) {
            throw new Error("Could not find domain.");
        }
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find domain",
            500
        );
        return next(error);
    }

    res.json({ domain: domain.toJSON() });
};

exports.getDomains = async (req, res, next) => {
    try {
        const domains = await Domain.findAll();
        res.json({ domains });
    } catch (err) {
        console.log(err);
        const error = new HttpError("Fetching domains failed, please try again later.", 500);
        return next(error);
    }
};

exports.createDomain = async (req, res, next) => {
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

    const { Domain, URL, Owner } = req.body;

    try {
        const existingDomain = await Domains.findOne({ where: { URL } });
        if (existingDomain) {
            const error = new HttpError(
                'Domain exists already, register another domain instead.',
                422
            );
            return next(error);
        }

        const newDomain = await DomainModel.create({ Domain, URL, Owner });
        res.status(201).json({ domainId: newDomain.id, Domain: newDomain.Domain, URL: newDomain.URL, Owner: newDomain.Owner });
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Registering domain failed, please try again',
            500
        );
        return next(error);
    }
};

exports.deleteDomain = async (req, res, next) => {
    const domainId = req.params.bid;

    let domain;
    try {
        domain = await Domains.findByPk(domainId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete domain.",
            500
        );
        return next(error);
    }

    if (!domain) {
        const error = new HttpError("Could not find this domain", 404);
        return next(error);
    }

    try {
        await domain.destroy();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete domain.",
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "Deleted domain." });
};