const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const shortid = require('shortid')

const PickerSchema = new Schema({
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
    pickedItems: {
        type: Number,
        required: true
    },
    profit: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

PickerSchema.pre('save', function (next) {
    this.usernameLower = this.username.toLowerCase()
    next();
});

let Picker = module.exports = mongoose.model('picker', PickerSchema)


module.exports.createSession = (picker, callback) => {
    picker.save(callback);
}

module.exports.getSessions = (callback) => {
    picker.find({}, callback)
}

module.exports.getUserData = (condition, callback) => {
    Picker.aggregate([
        { $match: condition },
        {
            $group: {
                _id: "$username",
                runtime: {
                    $sum: "$runtime"
                },
                pickedItems: {
                    $sum: "$pickedItems"
                },
                profit: {
                    $sum: "$profit"
                }
            }
        }
    ], callback)
}