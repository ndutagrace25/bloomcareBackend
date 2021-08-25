const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
    issue_name: {
        required: true,
        type: String
    },
    score: {
        type: Schema.Types.ObjectId,
        ref: 'score',
        required: true
    },
    issue_type: {
        type: Schema.Types.ObjectId,
        ref: 'issueType',
        required: true
    },
    tolerance_type: {
        type: Schema.Types.ObjectId,
        ref: 'toleranceType',
        required: true
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
const Issue = mongoose.model('issue', IssueSchema);
module.exports = Issue;