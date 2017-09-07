//Defines dependencies
var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
//require Article model
var Article = require("./models/Article.js");

mongoose.Promise = Promise;

var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

//connect to database with mongoose
mongoose.connect("mongodb://localhost/article-db");
var db = mongoose.connection;

//error logging
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

//Routes

app.get("/scrape", function(req, res) {
  request("https://arstechnica.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    //grab each headline
    $("type-report type-feature article").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      //save articles to Article model

      var entry = new Article(result);
      //save to database
      entry.save(function(err, doc) {

        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });
    });
  });
  res.send("Scaped!");
});

//route to get all the articles scraped from mongoDB
app.get("/articles", function(req, res) {
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

//Starts server on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
