const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const shortid = require('shortid')

const BarCrawlerSchema = new Schema({
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
    beersDrank: {
        type: Number,
        required: true
    },
    crawlsCompleted: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

BarCrawlerSchema.pre('save', function (next) {
    this.usernameLower = this.username.toLowerCase()
    next();
});

let BarCrawler = module.exports = mongoose.model('barcrawl', BarCrawlerSchema)


module.exports.createSession = (barCrawler, callback) => {
    barCrawler.save(callback);
}

module.exports.getSessions = (callback) => {
    barCrawler.find({}, callback)
}

module.exports.getUserData = (condition, callback) => {
    BarCrawler.aggregate([
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
                crawlsCompleted: {
                    $sum: "$crawlsCompleted"
                }
            }
        }
    ], callback)
}