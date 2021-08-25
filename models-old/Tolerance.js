const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToleranceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    from: {
        type: Number,
        required: true
    },
    to: {
        type: Number,
        required: true
    },
    tolerance_type: {
        type: Schema.Types.ObjectId,
        ref: 'toleranceType',
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
const Tolerance = mongoose.model('tolerance', ToleranceSchema);
module.exports = Tolerance;
//module.exports = Personnel = mongoose.model('personnel', PersonnelSchema);