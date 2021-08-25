const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoutSchema = new Schema({
    date: {
        required: true,
        type: Date
    },
    personnel: {
        //required: true,
        type: String
    },
    plant: {
        //required: true,
        type: Schema.Types.ObjectId,
        ref: 'plant'
    },
    entry: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'entry'
    },
    point: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'point'
    },
    issue: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'issue'
    },
    issueCategory: {
        type: Schema.Types.ObjectId,
        ref: 'issueCategory'
    },
    value: {
        required: true,
        type: String
    },
    tolerance: {
        type: Schema.Types.ObjectId,
        ref: 'tolerance'
    },
    latitude: {
        required: true,
        type: String
    },
    longitude: {
        required: true,
        type: String
    },

    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'personnel'
    },
    modified_by: {
        type: Schema.Types.ObjectId,
        ref: 'personnel'
    },
    created: {
        type: Date,
        default: Date.now
    }
});
const Scout = mongoose.model('scout', ScoutSchema);
module.exports = Scout;