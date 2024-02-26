document.addEventListener("DOMContentLoaded", function () {

	//get all date time objects
	dateTimes = document.getElementsByClassName("dateTime");
	

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



	// grid1elements = document.getElementsByClassName("grid1")

	// nestedDivs = grid1elements[0].children
	// console.log(nestedDivs)
});

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
	//getting number of dates
	dateboxes = document.getElementsByClassName("datebox");
	for (i = 1; i <= dateboxes.length; i++) {
		let gridString = "grid" + i;

		let grid = document.getElementById(gridString);

		gridItems = Array.from(grid.children);

		for (let j = 0; j < gridItems.length; j++) {
			console.log(
				gridString +
					" , item " +
					j +
					": " +
					gridItems[j].getAttribute("data-val")
			);
		}

		// gridItems.forEach(element => {
		//     element.getAttribute("data-val")
		//     console.log(element.getAttribute("data-val"))
		// });
	}
}

//send values from the calendar to the DB
async function sendMatrixData() {
	let matrix = [];

	dateboxes = document.getElementsByClassName("datebox");
	for (i = 1; i <= dateboxes.length; i++) {
		let row = [];

		//get right grid - day of the week, get all children from that grid
		let gridString = "grid" + i;
		let grid = document.getElementById(gridString);
		gridItems = Array.from(grid.children);

		gridItems.map(function (gridItem) {
			x = parseInt(gridItem.getAttribute("data-val"));
			row.push(x);
		});

		matrix.push(row);

		// for(let j=0; j < gridItems.length; j++){
		//     console.log(gridString + " , item " + j + ": " + gridItems[j].getAttribute("data-val"))
		//     row.
		// }

		// gridItems.forEach(element => {
		//     element.getAttribute("data-val")
		//     console.log(element.getAttribute("data-val"))
		// });
	}

	// console.log(matrix);

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

	// db.query(
	//     `INSERT INTO unavail (event_id, user_id, bit_matrix) VALUES (?, ?, ?)`,
	//     [1, 1, jsonMatrix],
	//     (error, results) => {
	//         if (error) {
	//             reject(error);
	//         } else {
	//             resolve(results);
	//         }
	//     }
	// );
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

	//TODO SEND FETCH REQUEST TO USE MATH MODULE LOL
	let matrixHolder = JSON.parse(data[0].bit_matrix);
	let sumMatrix = math.zeros(matrixHolder.length, matrixHolder[0].length);

	//CURRENTLY NOT WORKING TODO
	// for(let i = 0; i < data.length; i++){
	//     sumMatrix = math.add(sumMatrix, JSON.parse(data[i].bit_matrix))
	// }

	//THIS IS NOT WORKING CURRENTLY
	console.log("Ignore this, not working yet (sumMatrix): " + sumMatrix);
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