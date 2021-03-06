const {check, validationResult} = require('express-validator')

const Jimp = require('jimp')

let express = require('express');
let router = express.Router();


let {verifyHmac} = require("../../lib/hmac");

let ExampleScript = require('../../models/example-script')


router.get('/image', (req, res) => {
    let {username} = req.query

    let condition = {
        ...username && {username}
    }

    ExampleScript.getUserData(condition, (err, data) => {
        if (err) console.log(err)

        if (data) {
            new Jimp(900, 300, 'white', (err, image) => {
                if (err) return res.status(500).json({})

                Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {

                    image.print(font, 20, 20, `Runtime ${data.runTime}`)
                    image.print(font, 20, 50, `Logs Chopped ${data.logsCut}`)

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
        ...username && {username}
    }

    ExampleScript.getUserData(condition, (err, data) => {
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

    ExampleScript.findOne({sessionId: id}, (err, session) => {
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
    check('logsCut').exists(),
    check('username').exists(),
    verifyHmac
], (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {runtime, logsCut, username} = req.body

    ExampleScript.createSession(new ExampleScript({
        username: username,
        runtime: runtime,
        logsCut: logsCut
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
    check('logsCut').exists(),
    check('username').exists(),
    verifyHmac
], (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {runtime, logsCut, username} = req.body
    const {id} = req.params

    ExampleScript.findOne({sessionId: id}, (err, session) => {
        if (err) console.log(err)

        if (session) {
            session.runtime = runtime
            session.logsCut = logsCut
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
