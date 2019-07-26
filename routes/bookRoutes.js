var express = require('express');
var router = express.Router();

var bookController = require("../controllers/bookController");

router.get("/", bookController.getIndex);
router.get("/saved", bookController.getSaved);
router.post("/api/saveBook/:id", bookController.saveBook);
router.get("/api/notes/:id", bookController.getNotes);
router.post("/api/addNote/:id", bookController.addNotes);
router.post("/api/deleteNote/:id", bookController.deleteNote);

module.exports = router;