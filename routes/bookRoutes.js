var express = require('express');
var router = express.Router();

var bookController = require("../controllers/bookController");

router.get("/", bookController.getIndex);
router.get("/saved", bookController.getSaved);

module.exports = router;