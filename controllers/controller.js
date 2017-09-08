//defines dependencies
var express = require("express");
var router = express.Router();
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
//require Article model
var Article = require("../models/Article.js");
//require Comment model
var Comment = require("../models/Comment.js");

//The index page renderer
router.get("/", function(req, res) {
  res.render("index");
});

//renders the articles
router.get("/articles", function(req, res) {
  //returns list of all articles populated with user comments
  Article.find({})
    .populate("comments")

    .exec(function(error, doc) {

      if (error) {
        console.log(error);
      }

      else {
        var handleObj = {articles: doc}
        res.render("index", handleObj);
      }
    });
});

//Web Scraper
router.post('/scrape', function(req, res) {
  request("https://arstechnica.com/", function(error, response, html) {

    var $ = cheerio.load(html);

    
    $("article").each(function(i, element) {

      var result = {};
      //Below extracts the article title, nested under header under h2
      result.title = $(this).children("header").children("h2").children("a").text();
      console.log(result.title);

      //Collect the link of the article
      result.link = $(this).children("a").attr("href");
      console.log(result.link);


      //Create new entry in Article model
        
      var entry = new Article(result);

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
  res.redirect("/articles");
});

module.exports = router;
