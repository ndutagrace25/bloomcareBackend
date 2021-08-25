const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonnelTypeSchema = new Schema({
    name: {
        required: true,
        type: String
    }
});
const PersonnelType = mongoose.model('personnel_type', PersonnelTypeSchema);
module.exports = PersonnelType;