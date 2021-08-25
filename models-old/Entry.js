const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntrySchema = new Schema({
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
const Entry = mongoose.model('entry', EntrySchema);
module.exports = Entry;