document.addEventListener("DOMContentLoaded", function () {


	//get all date time objects
	dateTimes = document.getElementsByClassName("dateTime");
	otherDateTimes = document.getElementsByClassName("timeslot");


	//set event listeners for clicks and mousedown
	for (i = 0; i < otherDateTimes.length; i++) {
		// IF ALREADY SELECTED BY OTHER USERS -> DON'T ALLOW SELECTION
		//if(data[i] != "1")
		//{

		// dateTimes[i].addEventListener('mousedown', setInitialActiveState, false);
		// dateTimes[i].addEventListener('mouseover', setActive, false);
		// dateTimes[i].addEventListener('mousedown', setActive, false);

		otherDateTimes[i].addEventListener(
			"mousedown",
			setInitialActiveState,
			false
		);
		otherDateTimes[i].addEventListener("mouseover", setActive, false);
		otherDateTimes[i].addEventListener("mousedown", setActive, false);

		// dateTimes[i].addEventListener('touchstart', touchTest, false);
		// dateTimes[i].addEventListener('touchend', touchTest2, false);
		// dateTimes[i].addEventListener('touchmove', touchMoveTest, false);

		//add data-val attribute
		// dateTimes[i].setAttribute("data-val", 0)
		otherDateTimes[i].setAttribute("data-val", 0);
		//}
	}

	for (i = 0; i < dateTimes.length; i++) {
		dateTimes[i].addEventListener(
			"mousedown",
			setInitialActiveState,
			false
		);
		dateTimes[i].addEventListener("mouseover", setActive, false);
		dateTimes[i].addEventListener("mousedown", setActive, false);

		//add data-val attribute
		dateTimes[i].setAttribute("data-val", 0);
	}

	//deprecated, taking from csv, errors cause data is larger or smaller than event size
	// FOR EVERY DATE IN THE DATAFRAME -> IF IT IS 1 SET THAT DATE TO ALREADY-ACTIVE
	// for (let i = 0; i < data.length; i++) {
	// 	//if (data[i] == "1" && dateTimes[i])
	// 	if (data[i] == "1")
	// 		//dateTimes[i].classList.add("already-active");

	// 		otherDateTimes[i].classList.add("active");
	// 	// console.log(data[i])
	// 	//dateTimes[i].setAttribute("data-val", 1)
	// }

	//deprecated, taking from csv, errors cause data is larger or smaller than event size
	// for (let i = 0; i < data.length; i++) {
	// 	//if (data[i] == "1" && dateTimes[i])
	// 	if (data[i] == "1")
	// 		//dateTimes[i].classList.add("already-active");

	// 		//dateTimes[i].classList.add("active");
	// 		//console.log(data[i])
	// 		otherDateTimes[i].setAttribute("data-val", 1);
	// }

	// grid1elements = document.getElementsByClassName("grid1")

	// nestedDivs = grid1elements[0].children
	// console.log(nestedDivs)

});

//function to set default value of calendar
document.addEventListener("DOMContentLoaded", function () {
	startDate = document.getElementById("start-date");
	endDate = document.getElementById("end-date");

	if(startDate){
		startDate.addEventListener("change", function() {
			endDate.setAttribute("min", startDate.value);
			if(endDate.valueAsDate < startDate.valueAsDate){
				endDate.valueAsDate = startDate.valueAsDate;
			}
		})
		
		startDate.valueAsDate = new Date();
		endDate.valueAsDate = new Date();

		startDate.setAttribute("min", startDate.value);
	}
	
})



//
// function setActive(e) {
// 	//if left mouse button is being pressed
//     if(e.buttons == 1){

// 		//if grid-item is active already
//         if(this.classList.contains("active")){

// 			//remove it
//             this.classList.remove("active")
// 			this.setAttribute("data-val", 0)

// 			//otherwise set active
//         } else {
//             this.classList.add("active");
// 			this.setAttribute("data-val", 1)
//         }
//     }
// }

let isInitialActive = false;
// checks weather the initial one clicked is active
function setInitialActiveState(e) {
	isInitialActive = this.classList.contains("active");
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
		dayItems = (Array.from(day.children)).slice(1);

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

	let matrixArr = data.map((x) => JSON.parse(x.bit_matrix))

	console.log("matrixArr - scripts.js - :")
	console.log(matrixArr)

	matrixArr = JSON.stringify(matrixArr)

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
			body: matrixArr
		});

		//if all went well, say so
		if (response.ok == true) {
			console.log(
				"Data calculated successfully, code: " +
					response.status
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

	

	//todo comment
	//todo Rework to use dates etc to output days
	//array to put available coordinates of times in (ie: day, timeslot)
	let dateCoords = []

	//if summedMatrix returned with data
	if(summedMatrix.data){
		//set equal to this data for ease
		summedMatrix = summedMatrix.data;
		//iterate over each matrix and row
		for(i = 0; i < summedMatrix.length; i++){
			for(j = 0; j < summedMatrix[i].length; j++){
				//find times = to 0
				if(summedMatrix[i][j] == 0){
					//push those coords as available dates
					dateCoords.push([i, j]);
				}
			}
		}
	}

	console.log(dateCoords);
}

// function touchTest(e){

//     console.log("touch started")
// }

// function touchTest2(e){
//     this.classList.add("active");
//     console.log("touch ended")
// }

// function touchMoveTest(e){
//     this.classList.add("active");
//     console.log("touch moved")
// }

function joinEvent() {
	//check
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

async function gatherCalData() {
	let matrix = [];

	days = document.getElementsByClassName("day");
	for (i = 0; i < days.length - 1; i++) {
		let row = [];

		//get right grid - day of the week, get all children from that grid
		let dayString = "day" + i;
		let day = document.getElementById(dayString);

		//get all timeslots and remove dayOfTheWeek section
		dayItems = (Array.from(day.children)).slice(1);

		dayItems.map(function (dayItem) {
			x = parseInt(dayItem.getAttribute("data-val"));
			row.push(x);
		});

		matrix.push(row);
	}


	//turn our bit matrix into JSON
	jsonMatrix = JSON.stringify(matrix);

	console.log(jsonMatrix);
	

	return jsonMatrix;
}

async function calToDB() {
	//fetch request -> generate URL / check DB / save DB
	let cData = await gatherCalData();

	console.log(JSON.parse(cData));

	postData = {
		calData: JSON.parse(cData),
	sD: startDt,
	eD: endDt
	}

	console.log(postData);
	

	let eventUrl;
		//try this fetch promise with our api route for sending data to DB
		try {
			//reponse is equal to the result of the promise
			let response = await fetch("/saveEvent", {
				method: "POST",
	
				//tell the api we're using JSON and to parse it as such
				headers: {
					"Content-Type": "application/json",
				},
				//matrix we just made
				body: JSON.stringify(postData), 
			});
	
			//if all went well, say so
			if (response.ok == true) {
				console.log(
					"response ok TODO write response" +
						response.status
				);
					eventUrl = await response.json();
			} else {
				//if database request didnt go well
				console.log(
					"response womp womp TODO write response" +
						response.status +
						", text: " +
						response.statusText
				);
			}
	
			//else oh no, tell us what went wrong
		} catch (error) {
			console.error(error);
		}

		//if we have an event URL, show share section and set button text to this URL
		if(eventUrl){
			showShare();
			//TODO make this a link to planit with url link
			document.getElementById("link-button").innerText = eventUrl;
		}
}


// validation for login unit test for rouge inputs
function isValidUsername(username) {
    // checking valid charecters as symbols can be used in SQL injection attacks
    const regex = /^[a-zA-Z]+$/;
    return regex.test(username);
  }

// GENERATES URL FOR EVENT JOINING
function generateURL()
{
	// CHARACTER SET TO DRAW FROM
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let urlPassword = "";

	// FOR EVERY CHARARCTER OF PASSWORD LENGTH 1O
    for (let i = 0; i < 10; i++)
	{
		// GET RANDOM CHARACTER FROM CHARACTER SET (ROUND FLOATING POINT TO NEAREST NUMBER)
        const randomIndex = Math.floor(Math.random() * charset.length);

		// INCREMENT PASSWORD STRING WITH NEW INDEXED CHARATCER
        urlPassword += charset[randomIndex];
    }
    return urlPassword;
}

  module.exports = { isValidUsername, generateURL};

  // for exiting 404 
  function homePage() {
    window.location.href = '/'; 
  }