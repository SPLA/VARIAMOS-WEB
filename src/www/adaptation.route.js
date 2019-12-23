// adaptation.model.js

const express = require('express');
const adaptationRoutes = express.Router();

// Require Adaptation model in our routes module
let Adaptation = require('./adaptation.model');

// Defined store route
adaptationRoutes.route('/add').post(function (req, res) {
    let adaptation = new Adaptation(req.body);
    adaptation.save()
        .then(() => {
            res.status(200).json({ 'business': 'business in added successfully' });
        })
        .catch(() => {
            res.status(400).send("unable to save to database");
        });
});

// Defined get data(index or listing) route
adaptationRoutes.route('/').get(function (req, res) {
    Adaptation.find(function (err, adaptations) {
        if (err) {
            res.json(err);
        }
        else {
            console.log("Entro");
            res.json(adaptations);
        }
    });
});

//  Defined update route
adaptationRoutes.route('/delete/:id').post(function (req, res) {
    Adaptation.findById(req.params.id, function (err, adaptation) {

        if (!adaptation)
            res.status(404).send("data is not found");
        else {
            adaptation.estado = req.body.estado;
            adaptation.save().then(() => {
                res.json(req.body.estado);
            })
                .catch(() => {
                    res.status(400).send("unable to update the database");
                });
        }
    });
});

// Defined edit route
adaptationRoutes.route('/update/:id').post(function (req, res) {
    Adaptation.findById(req.params.id, function (err, adaptation) {
        if (!adaptation)
            res.status(404).send("data is not found");
        else { 
            adaptation.requirementNumber = req.body.requirementNumber,
            adaptation.reqType= req.body.reqType,
            adaptation.name= req.body.name,
            adaptation.condition= req.body.condition,
            adaptation.conditionDescription= req.body.conditionDescription,
            adaptation.imperative= req.body.imperative,
            adaptation.systemName= req.body.systemName,
            adaptation.processVerb= req.body.processVerb,
            adaptation.object= req.body.object,
            adaptation.system= req.body.system,
            adaptation.relaxing= req.body.relaxing,
            adaptation.postBehaviour= req.body.postBehaviour,
            adaptation.event= req.body.event,
            adaptation.timeInterval= req.body.timeInterval,
            adaptation.units= req.body.units,
            adaptation.quantity= req.body.quantity,
            adaptation.frecuency= req.body.frecuency,
            adaptation.quantityFrecuency= req.body.quantityFrecuency,
            adaptation.msg= req.body.msg;
            adaptation.save().then(() => {
                res.json(req.body.estado);
            })
            .catch(() => {
                  res.status(400).send("unable to update the database");
            });
        }
    });
});

adaptationRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Adaptation.findById(id, function (err, adaptation){
        if(err) {
          res.json(err);
        }
        res.json(adaptation);
    });
  });

module.exports = adaptationRoutes;