document.addEventListener("DOMContentLoaded", function(){

    // THIS IS THE DATA FROM THE CSV FILE -> DECLARED IN INDEX.EJS AS: <%- JSON.stringify(data) %>
    data = data.flat(); // TURNED FROM 2D ARRAY TO 1D ARRAY

	//get all date time objects
    dateTimes = document.getElementsByClassName("dateTime");
    otherDateTimes = document.getElementsByClassName("timeslot");

	//set event listeners for clicks and mousedown
    for(i=0; i < otherDateTimes.length; i++)
    {
        // IF ALREADY SELECTED BY OTHER USERS -> DON'T ALLOW SELECTION
        //if(data[i] != "1")
        //{
            
            //dateTimes[i].addEventListener('mousedown', setInitialActiveState, false);
            //dateTimes[i].addEventListener('mouseover', setActive, false);
            //dateTimes[i].addEventListener('mousedown', setActive, false);

            otherDateTimes[i].addEventListener('mousedown', setInitialActiveState, false);
            otherDateTimes[i].addEventListener('mouseover', setActive, false);
            otherDateTimes[i].addEventListener('mousedown', setActive, false);

            // dateTimes[i].addEventListener('touchstart', touchTest, false);
            // dateTimes[i].addEventListener('touchend', touchTest2, false);
            // dateTimes[i].addEventListener('touchmove', touchMoveTest, false);

		    //add data-val attribute
		    //dateTimes[i].setAttribute("data-val", 0)
            otherDateTimes[i].setAttribute("data-val", 0)
        //}
        
    }

    // FOR EVERY DATE IN THE DATAFRAME -> IF IT IS 1 SET THAT DATE TO ALREADY-ACTIVE
    for (let i = 0; i < data.length; i++)
    {
        //if (data[i] == "1" && dateTimes[i])
        if (data[i] == "1")
            //dateTimes[i].classList.add("already-active");
            
            otherDateTimes[i].classList.add("active");
           // console.log(data[i])
            //dateTimes[i].setAttribute("data-val", 1)
    }

    for (let i = 0; i < data.length; i++)
    {
        //if (data[i] == "1" && dateTimes[i])
        if (data[i] == "1")
            //dateTimes[i].classList.add("already-active");
            
            //dateTimes[i].classList.add("active");
            //console.log(data[i])
            otherDateTimes[i].setAttribute("data-val", 1)
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

function printData(){

    dateboxes = document.getElementsByClassName("datebox")
    for(i=1; i<=dateboxes.length; i++){
        let gridString = "grid" + i

        let grid = document.getElementById(gridString)
        
        gridItems = Array.from(grid.children)

        for(let j=0; j < gridItems.length; j++){
            console.log(gridString + " , item " + j + ": " + gridItems[j].getAttribute("data-val"))
        }

        // gridItems.forEach(element => {
        //     element.getAttribute("data-val")
        //     console.log(element.getAttribute("data-val"))
        // });
    }
    
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
    document.getElementById("landingSection").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("joinSection").style.display = "block";
}


function showLandingSection() {
    document.getElementById("landingSection").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("joinSection").style.display = "none";
}

function showLogin() {
    document.getElementById("landingSection").style.display = "none";
    document.getElementById("joinSection").style.display = "none";
    document.getElementById("login").style.display = "block";
}