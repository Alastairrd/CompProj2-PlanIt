// THIS IS USED TO GET THE LOGIC FROM calculateDates.js (UNIT TESTING PURPOSES)
const { calculateDates } = require("../scripts/calculateDates.js");

module.exports = function (app, csvData, filePath, fs, math) {
	// Handle our routes

	app.get("/", function (req, res) {
		res.render("index.ejs");
	});

	app.post("/eventCreation", async function (req, res) {
		//variables for event creation
		let passDates;
		let sD;
		let eD;
		let userName = req.body.hiddenName;

		if (req.body) {
			// USER INPUTS FROM CALENDAR
			const startDate = new Date(req.body["start-date"]);
			const endDate = new Date(req.body["end-date"]);

			// REFER TO 'calulcateDates.js' FOR LOGIC
			passDates = calculateDates(startDate, endDate);

			sD = startDate;
			eD = endDate;
		}

		if (passDates) {
			res.render("eventCreation.ejs", {
				dates: passDates,
				startDate: sD,
				endDate: eD,
				userName: userName,
			});
		} else {
			res.redirect("/");
		}
	});

	//creating an event and saving it into DB
	app.post("/saveEvent", async function (req, res) {
		//parse the body for date info
		startDate = new Date(req.body.sD);
		endDate = new Date(req.body.eD);
		let userName = req.body.userName;

		let reg = new RegExp("^[A-Za-z]{2,50}$");

		let nameCheck = reg.test(userName);

		//this formats JS Dates into MySQL DATE format
		const sDChanged = startDate.toJSON().slice(0, 19).replace("T", " ");
		const eDChanged = endDate.toJSON().slice(0, 19).replace("T", " ");

		//todo remove hardCoded user_id
		//let user_id = 1;

		//db query, check event table for URL value
		//variables for checks
		if (nameCheck == true) {
			let urlCheck = 1;
			let url;
			while (urlCheck == 1) {
				url = (function () {
					// CHARACTER SET TO DRAW FROM
					const charset =
						"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
					let urlPassword = "";

					// FOR EVERY CHARARCTER OF PASSWORD LENGTH 1O
					for (let i = 0; i < 10; i++) {
						// GET RANDOM CHARACTER FROM CHARACTER SET (ROUND FLOATING POINT TO NEAREST NUMBER)
						const randomIndex = Math.floor(
							Math.random() * charset.length
						);

						// INCREMENT PASSWORD STRING WITH NEW INDEXED CHARATCER
						urlPassword += charset[randomIndex];
					}
					return urlPassword;
				})();

				//checks if url exists in the DB, sets urlCheck to boolean 1 or 0 (0 means unique and go ahead)
				urlCheck = await new Promise((resolve, reject) => {
					db.query(
						`SELECT EXISTS(SELECT * FROM user_events WHERE event_url = ?) as urlExists`,
						url,
						(error, results) => {
							if (error) {
								reject(error);
							} else {
								resolve(results[0].urlExists);
							}
						}
					);
				});
			}

			let user_id = await new Promise((resolve, reject) => {
				db.query(
					`INSERT INTO users (user_name) VALUES (?)`,
					userName,
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results.insertId);
						}
					}
				);
			});

			//once unique url is found, save event
			let eventInserted = false;
			let eventInsertRes = await new Promise((resolve, reject) => {
				db.query(
					"INSERT INTO user_events (creator_id, event_url, start_date, end_date) VALUES (?, ?, ?, ?)",
					[user_id, url, sDChanged, eDChanged],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results.insertId);
							eventInserted = true;
						}
					}
				);
			});

			//use event id gathered here to insert availiability of event creator into newly created event
			let availInserted = false;
			if (eventInserted) {
				let availInsertRes = await new Promise((resolve, reject) => {
					db.query(
						`INSERT INTO unavail (event_id, user_id, bit_matrix) VALUES (?, ?, ?)`,

						//for some reason we need to stringify it again or else it seperates the array
						[
							eventInsertRes,
							user_id,
							JSON.stringify(req.body.calData),
						],
						(error, results) => {
							if (error) {
								reject(error);
							} else {
								resolve(results);
								availInserted = true;
							}
						}
					);
				});
			}

			//send back unique code for event to display
			if (availInserted == true) {
				console.log("worked");
				res.json(url);
			} else {
				res.send("500");
			}
		} else {
			console.log("invalid userName");
			res.send("422");
		}
	});

	//ROUTE for sending json array of unavailability to DB
	app.post("/matrixPost", async function (req, res) {
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

	// USER INPUTS DATES FOR RETURNED ARRAY OF DATES INFO
	app.post("/calculate-dates", (req, res) => {
		// USER INPUTS FROM CALENDAR
		const startDate = new Date(req.body["start-date"]);
		const endDate = new Date(req.body["end-date"]);

		// REFER TO 'calulcateDates.js' FOR LOGIC
		testDates = calculateDates(startDate, endDate);

		// ONTO NEXT PAGE
		res.redirect("/eventCreation");
	});

	app.get("/summary/:eventUrl", async function (req, res) {
		//get url from query
		let url = req.params.eventUrl;
		//check url exists
		let urlCheck = await new Promise((resolve, reject) => {
			db.query(
				`SELECT EXISTS(SELECT * FROM user_events WHERE event_url = ?) as urlExists`,
				url,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results[0].urlExists);
					}
				}
			);
		});

		//if url exists, get unavailability data
		if (urlCheck) {
			//if url exists, get event_id
			//select event and get event_id
			let eventData = await new Promise((resolve, reject) => {
				db.query(
					`SELECT event_id, creator_id, start_date, end_date FROM user_events WHERE event_url = ?`,
					url,
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results[0]);
						}
					}
				);
			});

			//save these for creating summary page
			let eventId = eventData.event_id;
			let creatorId = eventData.creator_id;

			//get all participant data
			let unavailData = await new Promise((resolve, reject) => {
				//gets the data from DB
				db.query(
					`SELECT * FROM unavail WHERE event_id = ?`,
					eventId,
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});

			//storing names of participants and matrices of availability
			let userNameList = [];
			let matrixArr = [];

			//gets all names of participants, and adds name to name array and matrix to matrix array
			for (i = 0; i < unavailData.length; i++) {
				//get user_name from the DB based on user_id
				let name = await new Promise((resolve, reject) => {
					db.query(
						`SELECT user_name FROM users WHERE user_id = ?`,
						unavailData[i].user_id,
						(error, results) => {
							if (error) {
								reject(error);
							} else {
								resolve(results[0].user_name);
							}
						}
					);
				});

				//create list of names and matrices
				userNameList.push(name);
				matrixArr.push(JSON.parse(unavailData[i].bit_matrix));
			}

			//get creator name
			let creatorName = await new Promise((resolve, reject) => {
				db.query(
					`SELECT user_name FROM users WHERE user_id = ?`,
					creatorId,
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results[0].user_name);
						}
					}
				);
			});

			//MATRIX CALCULATION SECTION
			//placeholder matrix for getting sizes
			let matrixHolder = matrixArr[0];

			//zero'd matrix the correct size, initialise matrix full of zeros
			let sumMatrix = math.zeros(
				matrixHolder.length,
				matrixHolder[0].length
			);

			//add each matrix to sum matrix
			matrixArr.forEach((matrix) => {
				sumMatrix = math.add(sumMatrix, matrix);
			});

			//get matrix from mathjs library object
			sumMatrix = sumMatrix._data;

			//MATRIX IS SUMMED, NOW GET RELEVANT DATA COORDINATES
			//array to put available coordinates of times in (ie: day, timeslot)
			let zeroCoords = [];
			let oneCoords = [];

			//iterate over each matrix and row
			for (i = 0; i < sumMatrix.length; i++) {
				for (j = 0; j < sumMatrix[i].length; j++) {
					//find times = to 0
					if (sumMatrix[i][j] == 0) {
						//push those coords as available dates
						zeroCoords.push([i, j]);
					}

					//if only one person busy push to this array
					if (sumMatrix[i][j] == 1) {
						oneCoords.push([i, j]);
					}
				}
			}

			//CREATING CALENDAR INFO FOR SUMMARY PAGE
			//get dates for calendar creation
			const startDate = eventData.start_date;
			const endDate = eventData.end_date;

			//calc dates for creating calendar
			passDates = calculateDates(startDate, endDate);

			//object to pass to page
			const summaryData = {
				zeroCoordinates: zeroCoords,
				oneCoordinates: oneCoords,
				userList: userNameList,
				creator: creatorName,
				dates: passDates,
			};

			res.render("summary.ejs", summaryData);
		} else {
			res.status(404);
			res.redirect("/404");
		}
	});

	app.get("/share/:eventUrl", async function (req, res) {
		//get url from query
		let url = req.params.eventUrl;

		//checks event exists with that url
		let urlCheck = await new Promise((resolve, reject) => {
			db.query(
				`SELECT EXISTS(SELECT * FROM user_events WHERE event_url = ?) as urlExists`,
				url,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results[0].urlExists);
					}
				}
			);
		});

		//object for passing into route
		let urlData = {
			eventUrl: url,
		};

		//if url/event exists
		if (urlCheck) {
			res.render("share.ejs", urlData);
		} else {
			res.status(404);
			res.redirect("/404");
		}
	});

	//route for a url
	app.get("/join/:eventUrl", async function (req, res) {
		//check url exists
		let url = req.params.eventUrl;
		//gets the data from DB
		let urlCheck = await new Promise((resolve, reject) => {
			db.query(
				`SELECT EXISTS(SELECT * FROM user_events WHERE event_url = ?) as urlExists`,
				url,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results[0].urlExists);
					}
				}
			);
		});

		//if it does, get date info to create calendar
		if (urlCheck) {
			let dates = await new Promise((resolve, reject) => {
				db.query(
					`SELECT start_date, end_date FROM user_events WHERE event_url = ?`,
					url,
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results[0]);
						}
					}
				);
			});

			//get dates for building calendar view
			let passDates;
			if (dates) {
				const startDate = new Date(dates.start_date);
				const endDate = new Date(dates.end_date);

				// REFER TO 'calulcateDates.js' FOR LOGIC
				passDates = calculateDates(startDate, endDate);
			}

			if (passDates) {
				//show join page with options
				res.render("join.ejs", { dates: passDates, eventUrl: url });
			}
		} else {
			console.log("false");
			res.redirect("/404");
		}
	});

	app.post("/addToEvent", async function (req, res) {
		//check url exists

		let url = req.body.url;
		let userName = req.body.userName;
		let jsonMatrix = req.body.calData;

		//gets the data from DB
		let urlCheck = await new Promise((resolve, reject) => {
			db.query(
				`SELECT EXISTS(SELECT * FROM user_events WHERE event_url = ?) as urlExists`,
				url,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results[0].urlExists);
					}
				}
			);
		});

		if (urlCheck) {
			//create user in DB using name value, get user id
			let userId = await new Promise((resolve, reject) => {
				db.query(
					`INSERT INTO users (user_name) VALUES (?)`,
					userName,
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results.insertId);
						}
					}
				);
			});

			//select event and get event_id
			let eventId = await new Promise((resolve, reject) => {
				db.query(
					`SELECT event_id FROM user_events WHERE event_url = ?`,
					url,
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results[0].event_id);
						}
					}
				);
			});

			//check availability for this user doesn't exist yet
			//not necessary for current code but if logins are implemented it would be helpful
			let availExists = await new Promise((resolve, reject) => {
				db.query(
					`SELECT EXISTS(SELECT * FROM unavail WHERE user_id = ? AND event_id = ?) as unavailExists`,
					[userId, eventId],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results[0].unavailExists);
						}
					}
				);
			});

			if (availExists == false) {
				//add calData to unavail using user_id and event_id
				db.query(
					`INSERT INTO unavail (event_id, user_id, bit_matrix) VALUES (?, ?, ?)`,

					//for some reason we need to stringify it again or else it seperates the array
					[eventId, userId, JSON.stringify(jsonMatrix)],
					(error, results) => {
						if (error) {
							console.error(error);
							res.status(500).send(
								"Error adding availability to event: " + error
							);
						} else {
							console.log(
								"availability added to event: " +
									eventId +
									", for user: " +
									userId
							);
							res.status(200).send("OK");
						}
					}
				);
			} else {
				res.status(409).send("error: user availability already exists");
			}
		} else {
			console.log("requested url not found");
			res.status(404).send("url not found");
		}
	});

	//404
	app.get("/404", function (req, res) {
		res.render("404.ejs");
	});

	// 404 ERRORS
	app.get("*", (req, res) => {
		res.render("404.ejs");
	});
};
