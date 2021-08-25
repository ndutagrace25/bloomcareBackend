const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToleranceTypeSchema = new Schema({
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
const ToleranceType = mongoose.model('toleranceType', ToleranceTypeSchema);
module.exports = ToleranceType;
//module.exports = Personnel = mongoose.model('personnel', PersonnelSchema);