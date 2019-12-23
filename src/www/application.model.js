// Application.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Application
let Application = new Schema({
    id: 0,
    requirementNumber: { type: String },
    reqType: { type: String },
    name: { type: String },
    condition: { type: Boolean },
    conditionDescription: { type: String },
    imperative: { type: String },
    systemName: { type: String },
    systemActivity: { type: String },
    user: { type: String },
    processVerb: { type: String },
    object: { type: String },
    system: { type: String },
    from: { type: String },
    processVerb: { type: String },
    systemCondition: { type: Boolean },
    systemConditionDescription: { type: String },
    msg: { type: String },
    estado: { type: Boolean},
    date_at: { type: Date }
}, {
        collection: 'applications'
    });

module.exports = mongoose.model('Application', Application);