// adaptation.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Adaptation
let Adaptation = new Schema({
    id: { type: Number },
    requirementNumber: { type: String },
    reqType: { type: String },
    name: { type: String },
    condition: { type: Boolean },
    conditionDescription: { type: String },
    imperative: { type: String },
    systemName: { type: String },
    processVerb: { type: String },
    object: { type: String },
    system: { type: String },
    relaxing: { type: String },
    postBehaviour: { type: String },
    event: { type: String },
    timeInterval: { type: Number },
    units: { type: String },
    quantity: { type: String },
    frecuency: { type: String },
    quantityFrecuency: { type: String },
    msg: { type: String },
    estado: { type: Boolean}
}, {
        collection: 'adaptations'
    });

module.exports = mongoose.model('Adaptation', Adaptation);