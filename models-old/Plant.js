const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantSchema = new Schema({
    plant_date: {
        type: Date,
        required: true
    },
    expected_pick_date: {
        type: Date,
    },
    bed: {
        type: Schema.Types.ObjectId,
        ref: 'bed',
        required: true
    },
    variety: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'variety'
    },
    status: {
        type: Number,
        required: true,
        default: 1
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
const Plant = mongoose.model('plant', PlantSchema);
module.exports = Plant;
//module.exports = Personnel = mongoose.model('personnel', PersonnelSchema);