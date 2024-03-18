// Import the modules we need
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const math = require('mathjs');
const cors = require('cors');


// Create the express application object
const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

//set app to be able to parse json
app.use(bodyParser.json());

// Define the database connection
const db = mysql.createConnection({
	host: "localhost",
	user: "planituser",
	password: "Pl4n1tN0w",
	database: "planit",
});

// Connect to the database
db.connect((err) => {
	if (err) {
		throw err;
	}
	console.log("Connected to database");
});
global.db = db;


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

// Requires the main.js file inside the routes folder passing in the Express app and data as arguments.  All the routes will go in this file
require("./routes/main")(app, math);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
