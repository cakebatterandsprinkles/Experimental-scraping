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

            // Now, we grab every h2 within an article tag, and do the following:
            $(".product_pod").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("h3")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");
                result.image = $(this)
                    .children("img")
                    .attr("src");

                // Create a new Article using the `result` object built from scraping
                db.Book.create(result)
                    .then(function (data) {
                        // View the added result in the console
                        console.log(data);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });

            // Send a message to the client
            res.send("Scrape Complete");
        });
}

exports.getSaved = function (req, res) {
    res.send("HI");
};