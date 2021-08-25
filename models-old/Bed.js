const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BedSchema = new Schema({
    bed_number: {
        //required: true,
        type: Number
    },
    number: {
        required: true,
        type: Number
    },
    bed_name: {
        required: true,
        type: String
    },
    block: {
        type: Schema.Types.ObjectId,
        ref: 'block'
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
const Bed = mongoose.model('bed', BedSchema);
module.exports = Bed;