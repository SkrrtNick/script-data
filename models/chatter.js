const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const shortid = require('shortid')

const ChatterSchema = new Schema({
    sessionId: {
        type: String,
        required: true,
        default: shortid.generate
    },
    username: {
        type: String,
        required: true
    },
    runtime: {
        type: Number,
        required: true
    },
    interactions: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

ChatterSchema.pre('save', function (next) {
    this.usernameLower = this.username.toLowerCase()
    next();
});

let Chatter = module.exports = mongoose.model('chatter', ChatterSchema)


module.exports.createSession = (chatter, callback) => {
    chatter.save(callback);
}

module.exports.getSessions = (callback) => {
    chatter.find({}, callback)
}

module.exports.getUserData = (condition, callback) => {
    chatter.aggregate([
        { $match: condition },
        {
            $group: {
                _id: "$username",
                runtime: {
                    $sum: "$runtime"
                },
                beersDrank: {
                    $sum: "$beersDrank"
                },
                interactions: {
                    $sum: "$interactions"
                }
            }
        }
    ], callback)
}