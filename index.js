// Import the modules we need
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const fs = require('fs');
const path = require('path');
const { log } = require("console");

// Create the express application object
const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));


const filePath = path.join(__dirname, 'test.csv');


// Set up css and scripts path
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/scripts"));

// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set("views", __dirname + "/views");

// Tell Express that we want to use EJS as the templating engine
app.set("view engine", "ejs");

// Tells Express how we should process html files
// We want to use EJS's rendering engine
app.engine("html", ejs.renderFile);

const csvData = null;


// Requires the main.js file inside the routes folder passing in the Express app and data as arguments.  All the routes will go in this file
require("./routes/main")(app, csvData, filePath, fs);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
