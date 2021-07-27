const crypto = require('crypto')
const secret = "secret"

module.exports.verifyHmac = (req, res, next) => {
    let hmacHash = req.body.hmac

    // If  HMAC doesn't exist, return a status of 400
    if (!hmacHash) return res.status(400).json({})

    // Verify the hmac
    let data = {...req.body}

    delete data.hmac

    const hmac = crypto.createHmac('sha256', secret)

    hmac.update(JSON.stringify(data))
    let digest = hmac.digest('base64').toString();

    if (digest !== hmacHash)
        return res.status(400).json({})

    next();
}