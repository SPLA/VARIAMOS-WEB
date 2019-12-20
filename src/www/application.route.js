// application.model.js

const express = require('express');
const applicationRoutes = express.Router();

// Require Application model in our routes module
let Application = require('./application.model');

// Defined store route
applicationRoutes.route('/add').post(function (req, res) {
    let application = new Application(req.body);
    application.save()
        .then(() => {
            res.status(200).json({ 'business': 'business in added successfully' });
        })
        .catch(() => {
            res.status(400).send("unable to save to database");
        });
});

// Defined get data(index or listing) route
applicationRoutes.route('/').get(function (req, res) {
    Application.find(function (err, applications) {
        if (err) {
            res.json(err);
        }
        else {
            console.log("Entro");
            res.json(applications);
        }
    });
});

//  Defined update route
applicationRoutes.route('/delete/:id').post(function (req, res) {
    Application.findById(req.params.id, function(err, application) {

    if (!application)
      res.status(404).send("data is not found");
    else {
        application.estado = req.body.estado;
        application.save().then(() => {
          res.json(req.body.estado);
      })
      .catch(() => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

//  Defined update route
applicationRoutes.route('/update/:id').post(function (req, res) {
  Application.findById(req.params.id, function(err, application) {

    if (!application)
      res.status(404).send("data is not found");
    else {
      application.requirementNumber= req.body.requirementNumber;
      application.reqType= req.body.reqType;
      application.name= req.body.name;
      application.condition= req.body.condition;
      application.conditionDescription= req.body.conditionDescription; 
      application.imperative= req.body.imperative,
      application.systemName= req.body.systemName;
      application.systemActivity=req.body.systemActivity,
      application.user= req.body.user;
      application.processVerb= req.body.processVerb;
      application.object= req.body.object;
      application.system= req.body.system;
      application.from= req.body.from;
      application.processVerb= req.body.processVerb;
      application.systemCondition= req.body.systemCondition;
      application.systemConditionDescription= req.body.systemConditionDescription;
      application.msg= req.body.msg;
      application.save().then(() => {
          res.json(req.body.estado);
      })
      .catch(() => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined edit route
applicationRoutes.route('/:id').get(function (req, res) {
  let id = req.params.id;
  Application.findById(id, function (err, application){
      if(err) {
        res.json(err);
      }
      res.json(application);
  });
});

module.exports = applicationRoutes;