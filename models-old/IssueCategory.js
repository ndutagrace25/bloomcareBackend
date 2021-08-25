const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueCategorySchema = new Schema({

    issue: {
        type: Schema.Types.ObjectId,
        ref: 'issue'
    },
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
const IssueCategory = mongoose.model('issueCategory', IssueCategorySchema);
module.exports = IssueCategory;
//module.exports = Personnel = mongoose.model('personnel', PersonnelSchema);