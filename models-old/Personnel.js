const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonnelSchema = new Schema({
    first_name: {
        required: true,
        type: String
    },
    last_name: {
        required: true,
        type: String
    },
    phone: {
        required: true,
        type: String
    },
    status: {
        required: true,
        type: Number
    },
    personnel_type_id: {
        type: Schema.Types.ObjectId,
        ref: 'personnel_type'
    },
    password: {
        allowNull: true,
        type: String
    },
    reset_password: {
        allowNull: true,
        type: Number,
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
const Personnel = mongoose.model('personnel', PersonnelSchema);
module.exports = Personnel;
//module.exports = Personnel = mongoose.model('personnel', PersonnelSchema);