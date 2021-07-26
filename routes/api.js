let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("test")
});

router.use('/scripts/example', require('./scripts/example'));

module.exports = router;
