//Defines dependencies
var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

mongoose.Promise = Promise;

var app = express();


