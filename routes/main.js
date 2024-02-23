module.exports = function (app, csvData, filePath, fs) {
	// Handle our routes

	app.get("/", async function (req, res) {
		const testData = await new Promise((resolve, reject) => {
			fs.readFile(filePath, "utf8", (err, data) => {
				// IF FILE READ ERROR IS THROWN -> REJECT
				if (err) reject(err);
				// ELSE READ FILE AS NORMAL
				else {
					//splits the data based on each new line, then iterate through the array of lines, and trim each one
					const lines = data.split("\n").filter((l) => l.trim());

					//slice off the first line
					linesSliced = lines.slice(1);

					//uses map to take each line, split into entries using comma delimiter
					handledData = linesSliced.map((l) => {
						const entries = l.split(",");

						//then we trim every entry incase
						const trimmedEntries = entries.map((e) => e.trim());

						//then we slice off the initial column of time rows
						finalEntries = trimmedEntries.slice(1);

						//return the trimmed entries without initial column
						return finalEntries;
					});

					//send the now processed data to the promise
					resolve(handledData);
				}
			});
		});

		console.log(testData);

		res.render("index.ejs", { data: testData });
	});

	//ROUTE for sending json array of unavailability to DB
	app.post("/matrixPost", async function (req, res) {
		console.log("TODO REMOVE: we made it this far");

		//matrix we passed into the request, its already a json string i think
		const jsonMatrix = req.body;

		console.log(jsonMatrix);

		//todo hardcoded values for testing function
		let user_id = 4;
		let event_id = 2;

		//sends the matrix to the DB as a JSON array
		db.query(
			`INSERT INTO unavail (event_id, user_id, bit_matrix) VALUES (?, ?, ?)`,

			//for some reason we need to stringify it again or else it seperates the array
			[event_id, user_id, JSON.stringify(jsonMatrix)],
			(error, results) => {
				if (error) {
					console.error(error);
					res.status(500).send(
						"Error saving data to database yo" + error
					);
				} else {
					console.log("hell yeah, saved that data");
					res.status(200).send("OK");
				}
			}
		);
	});

	app.get("/matrixGet", async function (req, res) {
		console.log("TODO REMOVE: we made it this far");

		//gets the data from DB
		db.query(
			`SELECT * FROM unavail WHERE event_id = 2`,
			(error, results) => {
				if (error) {
					console.error(error);
					res.status(500).send(
						"Error retrieving data from database yo" + error
					);
				} else {
					console.log("hell yeah, got that data");
					res.json(results);
				}
			}
		);

		
	});

	app.get("/landing", function (req, res) {
		res.render("landing.ejs");
	});
	app.get("/link", function (req, res) {
		res.render("link.ejs");
	});
	app.get("/share", function (req, res) {
		res.render("share.ejs");
	});
	app.get("/date", function (req, res) {
		res.render("date.ejs");
	});
	app.get("/summary", function (req, res) {
		res.render("summary.ejs");
	});

	// LOGIN PAGE
	app.get("/login", function (req, res) {
		res.render("login.ejs");
	});

	// CALENDAR PAGE
	app.get("/EventCalendar", function (req, res) {
		res.render("EventCalendar.ejs");
	});

	// CREATE EVENT TO SHARE PAGE
	app.get("/EventCreate", function (req, res) {
		res.render("EventCreate.ejs");
	});

	// EVENT CODE FOR OTHERS TO JOIN PAGE
	app.get("/EventURL", function (req, res) {
		res.render("EventURL.ejs");
	});

	// RESULTS OF EVERYONE'S INPUT PAGE
	app.get("/Results", function (req, res) {
		res.render("Results.ejs");
	});
};
