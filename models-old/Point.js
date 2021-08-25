const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PointSchema = new Schema({
    name: {
        required: true,
        type: String
    }
});
const Point = mongoose.model('point', PointSchema);
module.exports = Point;