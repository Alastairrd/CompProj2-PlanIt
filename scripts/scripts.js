document.addEventListener("DOMContentLoaded", function () {
	//get all date time objects
	//dateTimes = document.getElementsByClassName("dateTime");
	timeSlots = document.getElementsByClassName("timeslot");
	

	const timeSlotsTouch = document.querySelectorAll(".timeslot");

	//set event listeners for clicks and mousedown
	for (i = 0; i < timeSlots.length; i++) {
		timeSlots[i].addEventListener(
			"mousedown",
			setInitialActiveState,
			false
		);
		timeSlots[i].addEventListener("mouseover", setActive, false);
		timeSlots[i].addEventListener("mousedown", setActive, false);
		timeSlots[i].setAttribute("data-val", 0);
	}

	//get all timeslots and add touch event listeners, also disables scrolling of page when dealing with timeslots
	timeSlotsTouch.forEach((timeslotElement) => {
		//checking if touch is within a timeslot
		timeslotElement.addEventListener("touchmove", function (evt) {
			const touch = evt.touches[0];
			highlightHoveredObject(touch.clientX, touch.clientY);
		});

		//this is for setting initial state for setting active or inactive
		timeslotElement.addEventListener(
			"touchstart",
			setInitialActiveState,
			false
		);

		//disables normal scrolling of page behaviour
		timeslotElement.setAttribute("style", "touch-action: none");
	});
});

//function to set default value of calendar
document.addEventListener("DOMContentLoaded", function () {
	//get date elements
	startDate = document.getElementById("start-date");
	endDate = document.getElementById("end-date");

	//if startDate exists
	if (startDate) {
		//listen to startdate value, if it changes, change min and max of end date
		startDate.addEventListener("change", function () {
			endDate.setAttribute("min", startDate.value);
			if (endDate.valueAsDate < startDate.valueAsDate) {
				endDate.valueAsDate = startDate.valueAsDate;
			}

			//set max to 3 month ahead of start date
			let max = new Date(startDate.value);
			max.setMonth(max.getMonth() + 3);
			max = max.toISOString().split("T")[0];

			endDate.setAttribute("max", max);
		});

		//set initial values to today
		startDate.valueAsDate = new Date();
		endDate.valueAsDate = new Date();

		//set minimum values to today
		startDate.setAttribute("min", startDate.value);
		endDate.setAttribute("min", startDate.value);

		//set max to 3 month from now
		let max = new Date(startDate.value);
		max.setMonth(max.getMonth() + 3);
		max = max.toISOString().split("T")[0];

		endDate.setAttribute("max", max);
	}
});

let isInitialActive = false;
// checks whether the initial one clicked is active
function setInitialActiveState(e) {
	isInitialActive = this.classList.contains("active");
}

function highlightHoveredObject(x, y) {
	const timeSlots = document.querySelectorAll(".timeslot");
	timeSlots.forEach((timeslot) => {
		//check if the touch was within the boundaries of a timeslot element
		const rect = timeslot.getBoundingClientRect();
		if (
			!(
				x <= rect.left ||
				x >= rect.left + rect.width ||
				y <= rect.top ||
				y >= rect.top + rect.height
			)
		) {
			//sets active or inactive based on the initial state
			if (isInitialActive) {
				// set to deactivate if first element is active
				timeslot.classList.remove("active");
				timeslot.setAttribute("data-val", 0);
			} else {
				// else set to just activate
				timeslot.classList.add("active");
				timeslot.setAttribute("data-val", 1);
			}
		}
	});
}

function setActive(e) {
	if (e.buttons === 1) {
		if (isInitialActive) {
			// set to deactivate if first element is active
			this.classList.remove("active");
			this.setAttribute("data-val", 0);
		} else {
			// else set to just activate
			this.classList.add("active");
			this.setAttribute("data-val", 1);
		}
	}
}

function printData() {
	days = document.getElementsByClassName("day");
	for (i = 0; i < days.length - 1; i++) {
		let dayString = "day" + i;

		let day = document.getElementById(dayString);

		dayItems = Array.from(day.children);

		//start at one to ignore dayOfWeek element
		for (let j = 1; j < dayItems.length; j++) {
			console.log(
				dayString +
					" , item " +
					j +
					": " +
					dayItems[j].getAttribute("data-val")
			);
		}
	}
}

//send values from the calendar to the DB
async function sendMatrixData() {
	let matrix = [];

	days = document.getElementsByClassName("day");
	for (i = 0; i < days.length - 1; i++) {
		let row = [];

		//get right grid - day of the week, get all children from that grid
		let dayString = "day" + i;
		let day = document.getElementById(dayString);

		//get all timeslots and remove dayOfTheWeek section
		dayItems = Array.from(day.children).slice(1);

		dayItems.map(function (dayItem) {
			x = parseInt(dayItem.getAttribute("data-val"));
			row.push(x);
		});

		matrix.push(row);
	}

	//turn our bit matrix into JSON
	jsonMatrix = JSON.stringify(matrix);

	console.log(jsonMatrix);

	//try this fetch promise with our api route for sending data to DB
	try {
		//reponse is equal to the result of the promise
		const response = await fetch("/matrixPost", {
			method: "POST",

			//tell the api we're using JSON and to parse it as such
			headers: {
				"Content-Type": "application/json",
			},
			//matrix we just made
			body: jsonMatrix,
		});

		//if all went well, say so
		if (response.ok == true) {
			console.log(
				"Data sent to the database successfully, code: " +
					response.status
			);
		} else {
			//if database request didnt go well
			console.log(
				"No bueno sending that data chief, CODE: " +
					response.status +
					", text: " +
					response.statusText
			);
		}

		//else oh no, tell us what went wrong
	} catch (error) {
		console.error(error);
	}
}

async function getMatrixData() {
	let data = null;
	//try this fetch promise with our api route for sending data to DB
	try {
		//reponse is equal to the result of the promise
		const response = await fetch("/matrixGet", {});

		//if all went well, say so
		if (response.ok == true) {
			console.log(
				"Data recieved from database successfully, code: " +
					response.status
			);
			data = await response.json();
		} else {
			//if database request didnt go well
			console.log(
				"No bueno getting that data chief, CODE: " +
					response.status +
					", text: " +
					response.statusText
			);
		}

		//else oh no, tell us what went wrong
	} catch (error) {
		console.error(error);
	}

	console.log("DB data: ");
	console.log(data);
}

async function calcMatrixData() {
	let data = null;
	//try this fetch promise with our api route for sending data to DB
	try {
		//reponse is equal to the result of the promise
		const response = await fetch("/matrixGet", {});

		//if all went well, say so
		if (response.ok == true) {
			console.log(
				"Data recieved from database successfully, code: " +
					response.status
			);
			data = await response.json();
		} else {
			//if database request didnt go well
			console.log(
				"No bueno getting that data chief, CODE: " +
					response.status +
					", text: " +
					response.statusText
			);
		}

		//else oh no, tell us what went wrong
	} catch (error) {
		console.error(error);
	}

	console.log("DB data: ");
	console.log(data);

	let matrixArr = data.map((x) => JSON.parse(x.bit_matrix));

	console.log("matrixArr - scripts.js - :");
	console.log(matrixArr);

	matrixArr = JSON.stringify(matrixArr);

	//Send matrix data from DB to route handler to add all matrices together with mathjs
	let summedMatrix = -1;
	try {
		//reponse is equal to the result of the promise
		const response = await fetch("/matrixCalc", {
			method: "POST",

			headers: {
				"Content-Type": "application/json",
			},
			//matrix we just made
			body: matrixArr,
		});

		//if all went well, say so
		if (response.ok == true) {
			console.log(
				"Data calculated successfully, code: " + response.status
			);
			//returned summed matrix
			summedMatrix = await response.json();
		} else {
			//if database request didnt go well
			console.log(
				"No bueno calcing that data chief, CODE: " +
					response.status +
					", text: " +
					response.statusText
			);
		}

		//else oh no, tell us what went wrong
	} catch (error) {
		console.error(error);
	}

	//array to put available coordinates of times in (ie: day, timeslot)
	let dateCoords = [];

	//if summedMatrix returned with data
	if (summedMatrix.data) {
		//set equal to this data for ease
		summedMatrix = summedMatrix.data;
		//iterate over each matrix and row
		for (i = 0; i < summedMatrix.length; i++) {
			for (j = 0; j < summedMatrix[i].length; j++) {
				//find times = to 0
				if (summedMatrix[i][j] == 0) {
					//push those coords as available dates
					dateCoords.push([i, j]);
				}
			}
		}
	}
}

// each of the functions for changing which html main is showed within the landing page (refrences saved eleswher)
function showJoinSection() {
	document.getElementById("date").style.display = "none";
	document.getElementById("landingSection").style.display = "none";
	document.getElementById("login").style.display = "none";
	document.getElementById("joinSection").style.display = "block";
}

function showLandingSection() {
	document.getElementById("date").style.display = "none";
	document.getElementById("landingSection").style.display = "block";
	document.getElementById("login").style.display = "none";
	document.getElementById("joinSection").style.display = "none";
}

function showLogin() {
	document.getElementById("date").style.display = "none";
	document.getElementById("landingSection").style.display = "none";
	document.getElementById("joinSection").style.display = "none";
	document.getElementById("login").style.display = "block";
}

function showDate() {
	document.getElementById("landingSection").style.display = "none";
	document.getElementById("joinSection").style.display = "none";
	document.getElementById("login").style.display = "none";
	document.getElementById("date").style.display = "block";
}

function showShare() {
	document.getElementById("Calendar").style.display = "none";
	document.getElementById("Share").style.display = "block";
}

function showCalendar() {
	//todo do we need landing section
	//document.getElementById("landingSection").style.display = "none";
	document.getElementById("nameSection").style.display = "none";
	document.getElementById("Calendar").style.display = "block";
	document.getElementById("greetingNameSpan").innerText = document.getElementById("name").value;
}

function showName() {
	document.getElementById("landingSection").style.display = "none";
	document.getElementById("nameSection").style.display = "block";
	document.getElementById("Calendar").style.display = "none";
}

async function gatherCalData() {
	//create empty matrix
	let matrix = [];

	//get all columns of days from calendar
	days = document.getElementsByClassName("day");

	//iterate through the days
	for (i = 0; i < days.length - 1; i++) {
		let row = [];

		//get right column based of id concatenated with i
		let dayString = "day" + i;
		let day = document.getElementById(dayString);

		//get all timeslots and remove dayOfTheWeek section
		dayItems = Array.from(day.children).slice(1);

		//get all the data-val properties from timelots in day (availability)
		dayItems.map(function (dayItem) {
			x = parseInt(dayItem.getAttribute("data-val"));
			row.push(x);
		});

		//push array of days unavailability into matrix
		matrix.push(row);
	}

	//turn our bit matrix into JSON
	jsonMatrix = JSON.stringify(matrix);

	return jsonMatrix;
}

async function calToDB() {
	//fetch request -> generate URL / check DB / save DB
	let cData = await gatherCalData();

	let name = userName;

	//data to send to DB, including matrix of availability and start and end date selected for calendar
	postData = {
		calData: JSON.parse(cData),
		sD: startDt,
		eD: endDt,
		userName: name,
	};

	//initialise but dont define for future check
	let eventUrl;
	//try this fetch promise with our api route for sending data to DB
	try {
		//reponse is equal to the result of the promise
		let response = await fetch(
			"https://www.doc.gold.ac.uk/usr/717/saveEvent/",
			{
				method: "POST",

				//tell the api we're using JSON and to parse it as such
				headers: {
					"Content-Type": "application/json",
				},
				//matrix we just made
				body: JSON.stringify(postData),
			}
		);

		//if all went well, say so
		if (response.ok == true) {
			console.log("response OK" + response.status);
			eventUrl = await response.json();
		} else {
			//if database request didnt go well
			console.log(
				"database request rejected" +
					response.status +
					", text: " +
					response.statusText
			);
		}

		//else oh no, tell us what went wrong
	} catch (error) {
		console.error(error);
	}

	//if all went well and we have a url
	if (eventUrl) {
		//redirect to share page of new event
		window.location.replace(
			`https://www.doc.gold.ac.uk/usr/717/share/${eventUrl}`
		);
	}
}

function joinEvent() {
	let eventCode = document.getElementById("code").value;

	window.location.replace(
		`https://www.doc.gold.ac.uk/usr/717/join/${eventCode}`
	);
}

function homeRedirect() {
	window.location.replace("https://www.doc.gold.ac.uk/usr/717/");
}

async function addAvailToEvent() {
	//fetch request -> generate URL / check DB / save DB
	let cData = await gatherCalData();
	let name = document.getElementById("name").value;

	//object to pass into fetch
	postData = {
		calData: JSON.parse(cData),
		url: eventUrl,
		userName: name,
	};

	let response;
	//try this fetch promise with our api route for sending data to DB
	try {
		//reponse is equal to the result of the promise
		response = await fetch(
			"https://www.doc.gold.ac.uk/usr/717/addToEvent",
			{
				method: "POST",

				//tell the api we're using JSON and to parse it as such
				headers: {
					"Content-Type": "application/json",
				},
				//matrix we just made
				body: JSON.stringify(postData),
			}
		);

		//if all went well, say so
		if (response.ok == true) {
			console.log("response: " + response.status);
		} else {
			//if database request didnt go well
			console.log(response);
		}

		//else oh no, tell us what went wrong
	} catch (error) {
		console.error(error);
	}

	if (response.ok) {
		window.location.replace(
			`https://www.doc.gold.ac.uk/usr/717/share/${eventUrl}`
		);
	}
}

// validation for login unit test for rouge inputs
function isValidUsername(username) {
	// checking valid charecters as symbols can be used in SQL injection attacks
	const regex = /^[a-zA-Z]+$/;
	return regex.test(username);
}

// GENERATES URL FOR EVENT JOINING
function generateURL() {
	// CHARACTER SET TO DRAW FROM
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let urlPassword = "";

	// FOR EVERY CHARARCTER OF PASSWORD LENGTH 1O
	for (let i = 0; i < 10; i++) {
		// GET RANDOM CHARACTER FROM CHARACTER SET (ROUND FLOATING POINT TO NEAREST NUMBER)
		const randomIndex = Math.floor(Math.random() * charset.length);

		// INCREMENT PASSWORD STRING WITH NEW INDEXED CHARATCER
		urlPassword += charset[randomIndex];
	}
	return urlPassword;
}

// CHANGE APPEARANCE OF LINK BUTTON AND COPY BUTTON WHEN THEY ARE SELECTED
function changeButton(buttonID) {
	const button = document.getElementById(buttonID);

	// If function call, change style to 'clicked'
	button.classList.add('clicked');
	
	// Plus change text if it's the copy button
	if(button.classList.contains('copy-button')) {
		button.textContent = 'COPIED';
	}
	
}


// COPY CODE TO CLIPBOARD FUNCTIOANLITY
function copyToClipBoard() {
	// GET ID OF LINK BUTTON TO COPY VALUE
	const eventUrl = document.getElementById("link-button").innerText;

	// TUTORIAL CREDIT - https://www.youtube.com/watch?v=6vcCTymhIXY
	navigator.clipboard
		.writeText(eventUrl)
		.then(() => {
			showCopyBanner();
		})
		.catch((err) => {
			console.error("Failed to copy:", err);
		});
}

// TUTORIAL CREDIT - https://www.youtube.com/watch?v=1EN8_OxvPuY
function showCopyBanner() {
	// CREATE BANNER FROM DIV - POSITIONS, ANIMATIONS ETC
	const banner = document.createElement("div");
	banner.innerText = "Code copied!";
	banner.style.position = "fixed";
	banner.style.left = "0";
	banner.style.right = "0";
	banner.style.bottom = "-50px";
	banner.style.backgroundColor = "#4CAF50";
	banner.style.color = "white";
	banner.style.textAlign = "center";
	banner.style.padding = "10px 0";
	banner.style.transition = "bottom 0.5s ease";

	// ADD BANNER TO BODY OF 'share.ejs'
	document.body.appendChild(banner);

	// SLIDE UP ANIMATION
	setTimeout(() => {
		banner.style.bottom = "0";
	}, 100);

	// SLIDE OFF THE PAGE - 3 seconds
	setTimeout(() => {
		banner.style.bottom = "-50px";
		setTimeout(() => banner.remove(), 500);
	}, 3000);
}

// for exiting 404
function homePage() {
	window.location.href = "https://www.doc.gold.ac.uk/usr/717/";
}
