const { forEach } = require("mathjs");

module.exports = function (app, csvData, filePath, fs, math) {
	// Handle our routes

	var testDates;

	app.get("/", function (req, res) {
		res.render("index.ejs");
	});

	app.post("/eventCreation", async function (req, res) {
		//TODO remove
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

		let passDates;

		if (req.body) {
			const startDate = new Date(req.body["start-date"]);
			const endDate = new Date(req.body["end-date"]);

			console.log(req.body);

			// EXTRACT START TO FINISH DATE
			const diffTime = endDate - startDate;
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // FIND NUMBER OF DAYS (DIFFTIME IS FOUND IN MILLISECONDS)

			// ARRAY OF DATES TO BE RETURNED
			//let dates = [];
			passDates = [];

			// FOR EVERY DAY
			for (let i = 0; i <= diffDays; i++) {
				// CREATE NEW DATE OBJECT
				let currentDate = new Date(startDate);
				currentDate.setDate(currentDate.getDate() + i); // SET NEW DATE OBJECT FOR EVERY ITERATION e.g. 18TH - 20TH = 1, 2, 3 DAYS

				// RETURN DATE AS A NUMBER e.g. 18th April -> 18
				let day = currentDate.getDate();

				// FOR UI PURPOSES, TAKE STRING, CUT OFF FIRST THREE LETTERS -> SET TO UPPER CASE
				let weekday = currentDate
					.toLocaleString("en-EN", { weekday: "short" })
					.toUpperCase();

				// PUSH DATE OBJECT TO ARRAY
				passDates.push({
					date: `${day}`, // DAY NUMBER
					dayOfWeek: weekday, // DAY OF WEEK
				});
			}
		}

		//console.log(testData);

		if (passDates) {
			res.render("eventCreation.ejs", {
				data: testData,
				dates: passDates,
			});
		} else {
			res.redirect("/");
		}
	});

	//todo
	app.post("/saveEvent", async function (req, res) {});

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

		//TODO get event from URL, get event_id from this

		//TODO change query to use event_id from DB

		//gets the data from DB
		db.query(
			`SELECT * FROM unavail WHERE event_id = 3`,
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

	app.post("/matrixCalc", async function (req, res) {
		//matrix we passed into the request, for some reason it unJSON's itself
		const matrixArr = req.body;

		console.log("matrixArr: ");
		console.log(matrixArr);

		//placeholder matrix for getting sizes
		let matrixHolder = matrixArr[0];

		console.log("matrixHolder: ");
		console.log(matrixHolder);

		//zero'd matrix the correct size
		let sumMatrix = math.zeros(matrixHolder.length, matrixHolder[0].length);

		console.log("sumMatrix: ");
		console.log(sumMatrix);

		//add each matrix to sum matrix
		matrixArr.forEach((matrix) => {
			sumMatrix = math.add(sumMatrix, matrix);
		});

		console.log("sumMatrix post adding: ");
		console.log(sumMatrix);

		res.send(sumMatrix);
	});

	//OZZES ROUTES WHEY

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

	// USER INPUTS DATES FOR RETURNED ARRAY OF DATES INFO
	app.post("/calculate-dates", (req, res) => {
		// TAKE THE VALUES FROM /date FORMS
		// const startDate = new Date(req.body['start-date']);
		// const endDate = new Date(req.body['end-date']);

		const startDate = new Date(req.body["start-date"]);
		const endDate = new Date(req.body["end-date"]);

		console.log(req.body);

		// EXTRACT START TO FINISH DATE
		const diffTime = endDate - startDate;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // FIND NUMBER OF DAYS (DIFFTIME IS FOUND IN MILLISECONDS)

		// ARRAY OF DATES TO BE RETURNED
		let dates = [];

		// FOR EVERY DAY
		for (let i = 0; i <= diffDays; i++) {
			// CREATE NEW DATE OBJECT
			let currentDate = new Date(startDate);
			currentDate.setDate(currentDate.getDate() + i); // SET NEW DATE OBJECT FOR EVERY ITERATION e.g. 18TH - 20TH = 1, 2, 3 DAYS

			// RETURN DATE AS A NUMBER e.g. 18th April -> 18
			let day = currentDate.getDate();

			// FOR UI PURPOSES, TAKE STRING, CUT OFF FIRST THREE LETTERS -> SET TO UPPER CASE
			let weekday = currentDate
				.toLocaleString("en-EN", { weekday: "short" })
				.toUpperCase();

			// PUSH DATE OBJECT TO ARRAY
			dates.push({
				date: `${day}`, // DAY NUMBER
				dayOfWeek: weekday, // DAY OF WEEK
			});
		}

		// STORE DATES FOR LATER RENDERING
		testDates = dates;

		// NOW REDIRECT TO CALENDER PAGE
		res.redirect("/eventCreation");
	});

	// 404 ERRORS
	app.get('*', (req, res) => {
		res.render("404.ejs")
	})

	app.get("/dbtest", (req, res) => {
		res.render("dbtest.ejs");
	});

};
