

document.addEventListener("DOMContentLoaded", () => {
	//todo write code to set css for diff coords
	let timeslots = Array.from(
		document.getElementsByClassName("summary-timeslot")
	);

	//sets everything to unavailable first
	timeslots.forEach((timeslot) => {
		timeslot.classList.add("unavailable");
	});

	//sets all timeslots where everyone is free
	zeroCoords.forEach((coords) => {
		let cell = document.getElementById(`col${coords[0]}-row${coords[1]}`);

		cell.classList.add("zeroCoord");
		cell.classList.remove("unavailable");
	});

	//sets all timeslots where only one person is free
	oneCoords.forEach((coords) => {
		let cell = document.getElementById(`col${coords[0]}-row${coords[1]}`);

		cell.classList.add("oneCoord");
		cell.classList.remove("unavailable");
	});

	//array for storing time stretches
	let zeroStretches = [];
	let oneStretches = [];

	if(zeroCoords.length > 0){
		getStretches(zeroCoords, zeroStretches);
	}

	if(oneCoords.length > 0){
		getStretches(oneCoords, oneStretches);
	}
	
	

	zeroStretches.sort((a, b) => b.sLength - a.sLength);
	oneStretches.sort((a, b) => b.sLength - a.sLength);

	console.log(zeroStretches);
	console.log(oneStretches);

	const idealList = document.getElementById("ideal-time-section-list");
	const lessIdealList = document.getElementById("lessIdeal-time-section-list")
	const timeList = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

	if(zeroStretches.length > 3){
		displayTimes(zeroStretches, idealList, timeList);
	} else if(zeroStretches.length == 3){
		displayTimes(zeroStretches, idealList, timeList);
		document.getElementById("showMoreButton").setAttribute("style", "display: none")
	}else if(zeroStretches.length > 0 && oneStretches.length > 0){
		document.getElementById("lessIdeal-time-section-main").setAttribute("style", "display: block")
		document.getElementById("showMoreButton").setAttribute("style", "display: none")

		displayTimes(zeroStretches, idealList, timeList);
		displayTimes(oneStretches, lessIdealList, timeList);

	} else if(zeroStretches.length == 0 && oneStretches.length > 0){

		document.getElementById("ideal-time-section-main").setAttribute("style", "display: none")
		document.getElementById("lessIdeal-times-display-text").innerText = "There are no times you are all available! But here are some where all but one of you are."
		document.getElementById("lessIdeal-time-section-main").setAttribute("style", "display: block")

		displayTimes(oneStretches, lessIdealList, timeList);
	} else {
		document.getElementById("ideal-time-section-main").setAttribute("style", "display: none")
		document.getElementById("lessIdeal-times-display-text").innerText = "There are no times you are all available! There are also no times where all but 1 of you are available. Perhaps try another time?"
		document.getElementById("lessIdeal-time-section-main").setAttribute("style", "display: block")
	}
	

	
});

function displayTimes(array, outputList, timeList){
	for (i = 0; i < array.length; i++) {
		const stretchIndex = array[i].x;
		const stretchStart = array[i].yStart;
		const stretchEnd = array[i].yEnd;

		const ele = document.createElement("li");
		if (i > 2) {
			ele.setAttribute("style", "display: none");
		}
		const text = document.createTextNode(
			`${dateInfo[stretchIndex].month} ${dateInfo[stretchIndex].date}, ${
				dateInfo[stretchIndex].dayOfWeek
			} ${timeList[stretchStart]}:00 - ${timeList[stretchEnd + 1]}:00`
		);
		ele.appendChild(text);

		outputList.appendChild(ele);
	}
}

function getStretches(array, outputArray) {
	console.log(array);
	//temp variables for building timestretches
	let tempX;
	let tempY;
	let tempY2;

	//iterate over all coordinates
	for (i = 0; i <= array.length; i++) {
		if(array.length == 0){
			console.log("times array empty");
			break;
		}
		//if at end and we have variable, push
		if (i == array.length && typeof tempX !== "undefined") {
			//end push
			console.log("end push at: ");
			console.log(tempX);
			console.log(tempY2);
			console.log("--");
			outputArray.push({
				x: tempX,
				yStart: tempY,
				yEnd: tempY2,
				sLength: 1 + tempY2 - tempY,
			});
			break;
		}

		//helper variables
		let x = array[i][0];
		let y = array[i][1];

		//if nothing is initialised
		if (typeof tempX === "undefined") {
			tempX = x;
			tempY = y;
			tempY2 = y;

			//if same column
		} else if (tempX == x) {
			//if y is next to current y
			if (y == tempY2 + 1) {
				tempY2 = y;

				//otherwise stretch has ended, push to array and reset
			} else {
				console.log("stretch end push at: ");
				console.log(array[i][0]);
				console.log(array[i][1]);
				console.log("--");
				outputArray.push({
					x: tempX,
					yStart: tempY,
					yEnd: tempY2,
					sLength: 1 + tempY2 - tempY,
				});

				tempX = x;
				tempY = y;
				tempY2 = y;
			}
			//if not same column then push and reset
		} else {
			console.log("not same column push at: ");
			console.log(array[i][0]);
			console.log(array[i][1]);
			console.log("--");
			outputArray.push({
				x: tempX,
				yStart: tempY,
				yEnd: tempY2,
				sLength: 1 + tempY2 - tempY,
			});

			tempX = x;
			tempY = y;
			tempY2 = y;
		}
	}
}

function showMoreTimes() {
	const list = document.getElementById("ideal-time-section-list");

	const elements = Array.from(list.children);

	elements.forEach(ele => {
		ele.setAttribute("style", "display: block")
	})

	document.getElementById("showMoreButton").setAttribute("style", "display: none")
	document.getElementById("showLessButton").setAttribute("style", "display: block")

	document.getElementById("ideal-times-display-text").innerText = "All the times everyone can make so far are:"
}

function showLessTimes() {
	const list = document.getElementById("ideal-time-section-list");

	const elements = Array.from(list.children);

	for(i = 0; i < elements.length; i++){
		if(i > 2){
			elements[i].setAttribute("style", "display: none")
		}
	}

	document.getElementById("showLessButton").setAttribute("style", "display: none")
	document.getElementById("showMoreButton").setAttribute("style", "display: block")
	

	document.getElementById("ideal-times-display-text").innerText = "Here are some times everyone can make so far are:"
}
