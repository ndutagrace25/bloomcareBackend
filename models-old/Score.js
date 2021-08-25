const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    name: {
        required: true,
        type: String
    }
});
const Score = mongoose.model('score', ScoreSchema);
module.exports = Score;