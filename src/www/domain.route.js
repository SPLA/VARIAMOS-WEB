// domain.model.js

const express = require('express');
const domainRoutes = express.Router();

// Require Adaptation model in our routes module
let Domain = require('./domain.model');

// Defined store route
domainRoutes.route('/add').post(function (req, res) {
    let domain = new Domain(req.body);
    domain.save()
        .then(() => {
            res.status(200).json({ 'business': 'business in added successfully' });
        })
        .catch(() => {
            res.status(400).send("unable to save to database");
        });
});

// Defined get data(index or listing) route
domainRoutes.route('/').get(function (req, res) {
    Domain.find(function (err, domains) {
        if (err) {
            res.json(err);
        }
        else {
            console.log("Entro");
            res.json(domains);
        }
    });
});

//  Defined update route
domainRoutes.route('/delete/:id').post(function (req, res) {
    Domain.findById(req.params.id, function (err, domain) {

        if (!domain)
            res.status(404).send("data is not found");
        else {
            domain.estado = req.body.estado;
            domain.save().then(() => {
                res.json(req.body.estado);
            })
                .catch(() => {
                    res.status(400).send("unable to update the database");
                });
        }
    });
});

// Defined find route
domainRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Domain.findById(id, function (err, domain) {
        if (err) {
            res.json(err);
        }
        res.json(domain);
    });
});


domainRoutes.route('/update/:id').post(function (req, res) {
    Domain.findById(req.params.id, function (err, domain) {

        if (!domain)
            res.status(404).send("data is not found");
        else {
            console.log(req.body);
            domain.id = req.body.id;
            domain.requirementNumber = req.body.requirementNumber;
            domain.affectedSystems = req.body.affectedSystems;
            domain.thoseCodition = req.body.thoseCodition;
            domain.reqType = req.body.reqType;
            domain.name = req.body.name;
            domain.condition = req.body.condition;
            domain.conditionDescription = req.body.conditionDescription;
            domain.imperative = req.body.imperative;
            domain.systemName = req.body.systemName;
            domain.systemActivity = req.body.systemActivity;
            domain.user = req.body.user;
            domain.processVerb = req.body.processVerb;
            domain.object = req.body.object;
            domain.system = req.body.system;
            domain.from = req.body.from;
            domain.systemCondition = req.body.systemCondition;
            domain.systemConditionDescription = req.body.systemConditionDescription;
            domain.msg = req.body.msg;
            domain.save().then(() => {
                res.json(req.body.estado);                
            })
                .catch(() => {
                    res.status(400).send("unable to update the database");
                });
        }
    });
});

module.exports = domainRoutes;