var db = require("../models/index");

var axios = require("axios");
var cheerio = require("cheerio");

exports.getIndex = function (req, res) {
    scrape(req, res);
};

function scrape(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://books.toscrape.com/index.html").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        var results = [];
        // Now, we grab every h2 within an article tag, and do the following:
        $(".product_pod").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .find("h3>a")
                .attr("title");
            result.link = $(this)
                .find("h3>a")
                .attr("href");
            result.img = $(this)
                .find(".image_container img")
                .attr("src");

            results.push(result);
        });

        // Create a new Article using the `result` object built from scraping
        db.Book.create(results)
            .then(function () {
                db.Book.find({
                    saved: false
                }, function (err, result) {
                    res.render('index', {
                        books: result
                    });
                });
            })
            .catch(function (err) {
                db.Book.find({
                    saved: false
                }, function (err, result) {
                    res.render('index', {
                        books: result
                    });
                });
            });

    });
}

exports.getNotes = function (req, res) {
    var id = req.params.id;

    db.Book.findById(id)
        .populate('note')
        .exec(function (err, result) {
            res.json(result.note);
        });
}

exports.addNotes = function (req, res) {
    var id = req.params.id;

    db.Book.findById(id, function (err, book) {
        db.Note.create({
            body: req.body.note
        }).then(function (note) {
            book.note.push(note);
            book.save(function () {
                res.status(200).end();
            });
        });

    });
}
exports.deleteNote = function (req, res) {
    var id = req.params.id;

    db.Note.deleteOne({
        _id: id
    }, function (err) {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });
}

exports.saveBook = function (req, res) {
    var id = req.params.id;
    var saved = req.body.saved;

    db.Book.update({
        "_id": id
    }, {
        $set: {
            "saved": saved
        }
    }, function (err, raw) {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });
}

exports.getSaved = function (req, res) {
    db.Book.find({
        saved: true
    }, function (err, result) {
        res.render('saved', {
            books: result
        });
    });
};