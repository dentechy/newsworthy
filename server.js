//Defines dependencies
var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");
//require Article model
var Article = require('./models/Article.js');

mongoose.Promise = Promise;
//Starts Express server
var app = express();
//Error logging and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
//public becomes a static directory
app.use(express.static("public"));
//sets handlebars as default template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//connect to database with mongoose
mongoose.connect("mongodb://localhost/article-db");
var db = mongoose.connection;

//error logging
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

//Routes are defined in controller.js...
var router = require("./controllers/controller.js");
app.use("/", router);


//Starts server on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
