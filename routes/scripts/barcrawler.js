const {check, validationResult} = require('express-validator')

const Jimp = require('jimp')

let express = require('express');
let router = express.Router();


let {verifyHmac} = require("../../lib/hmac");

let BarCrawler = require('../../models/barcrawler-model')


router.get('/image', (req, res) => {
    let {username} = req.query

    let condition = {
        ...username && {usernameLower: username.toLowerCase()}
    }

    BarCrawler.getUserData(condition, (err, data) => {
        if (err) console.log(err)

        if (data) {
            new Jimp(900, 300, 'white', (err, image) => {
                if (err) return res.status(500).json({})

                Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {

                    image.print(font, 20, 20, `Runtime ${data.runtime}`)
                    image.print(font, 20, 50, `Beers Drank ${data.beersDrank}`)
                    image.print(font, 20, 70, `Crawls Completed ${data.crawlsCompleted}`)

                    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                        res.set("Content-Type", Jimp.MIME_PNG)

                        return res.send(buffer)
                    })
                }).catch(error => {

                })
            })
        } else {
            return res.status(500).json({})
        }
    })


})


/*

    GET ALL SESSIONS

 */

router.get('/', (req, res) => {
    let username = req.query.username

    let condition = {
        ...username && {usernameLower: username.toLowerCase()}
    }

    BarCrawler.getUserData(condition, (err, data) => {
        if (err) console.log(err)

        if (data) {
            return res.json(data)
        } else {
            return res.status(500).json({})
        }
    })
});


/*

    GET SESSION BASED ON ID

 */
router.get('/:id', [
    check('id').exists()
], (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {id} = req.params

    BarCrawler.findOne({sessionId: id}, (err, session) => {
        if (err) console.log(err)

        if (session) {
            return res.json(session)
        } else {
            return res.status(400).json({
                error: "Failed to find session for specified ID"
            })
        }
    })

    res.status(200)
})


/*

    CREATE

 */
router.post('/', [
    check('runtime').exists(),
    check('beersDrank').exists(),
    check('crawlsCompleted').exists(),
    check('username').exists(),
    verifyHmac
], (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {runtime, beersDrank,crawlsCompleted, username} = req.body

    BarCrawler.createSession(new BarCrawler({
        username: username,
        runtime: runtime,
        beersDrank: beersDrank,
        crawlsCompleted: crawlsCompleted
    }), (err, session) => {
        if (err) console.log(err)

        if (session) {
            return res.json({
                id: session.sessionId
            })
        } else {
            return res.status(500)
        }
    })
})

/*

    UPDATE

 */
router.put('/:id', [
    check('id').exists(),
    check('runtime').exists(),
    check('beersDrank').exists(),
    check('crawlsCompleted').exists(),
    check('username').exists(),
    verifyHmac
], (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {runtime,  beersDrank,crawlsCompleted, username} = req.body
    const {id} = req.params

    BarCrawler.findOne({sessionId: id}, (err, session) => {
        if (err) console.log(err)

        if (session) {
            session.runtime = runtime
            session.beersDrank = beersDrank
            session.crawlsCompleted = crawlsCompleted
            session.username = username

            session.save()

            return res.json({
                success: true
            })
        } else {
            return res.status(400).json({
                error: "Failed to find session for specified ID"
            })
        }
    })
})

/*

    DELETE

 */
router.delete('/:id', (req, res) => {

})

module.exports = router;
