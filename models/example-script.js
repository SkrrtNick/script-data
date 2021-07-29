const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const shortid = require('shortid')

const ExampleScriptSchema = new Schema({
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
    logsCut: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

let ExampleScript = module.exports = mongoose.model('Example', ExampleScriptSchema)


module.exports.createSession = (exampleScript, callback) => {
    exampleScript.save(callback);
}

module.exports.getSessions = (callback) => {
    ExampleScript.find({}, callback)
}

module.exports.getUserData = (condition, callback) => {
    ExampleScript.aggregate([
        {$match: condition},
        {
            $group: {
                _id: null,
                runtime: {
                    $sum: "$runtime"
                },
                logsChopped: {
                    $sum: "$logsCut"
                }
            }
        }
    ], callback)
}