const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BedPlantSchema = new Schema({

    bed: {
        type: Schema.Types.ObjectId,
        ref: 'bed'
    },
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'plant'
    },

    created: {
        type: Date,
        default: Date.now
    }
});
const BedPlant = mongoose.model('bedplant', BedPlantSchema);
module.exports = BedPlant;