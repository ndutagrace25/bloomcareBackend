const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlockSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    number: {
        // required: true,
        type: Number
    },
    parent: {
        type: Schema.Types.ObjectId,
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
const Block = mongoose.model('block', BlockSchema);
module.exports = Block;