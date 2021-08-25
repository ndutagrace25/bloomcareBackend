const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueTypeSchema = new Schema({
    name: {
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
const IssueType = mongoose.model('issueType', IssueTypeSchema);
module.exports = IssueType;
//module.exports = Personnel = mongoose.model('personnel', PersonnelSchema);