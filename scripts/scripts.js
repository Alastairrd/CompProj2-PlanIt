document.addEventListener("DOMContentLoaded", function(){

	//get all date time objects
    dateTimes = document.getElementsByClassName("dateTime");

	//set event listeners for clicks and mousedown
    for(i=0; i < dateTimes.length; i++)
    {
        dateTimes[i].addEventListener('mouseover', setActive, false);
        dateTimes[i].addEventListener('mousedown', setActive, false);

		//add data-val attribute
		dateTimes[i].setAttribute("data-val", 0)
    }





	//archie stuff
    
    populateDate = document.getElementsByClassName("dateTime2");


    for(i = 0; i < populateDate.length; i++)
    {
      // POPULATE EACH DATE ITERATIVELY - IF 1 -> SET ACTIVE
    }

});

//
function setActive(e) {
	//if left mouse button is being pressed
    if(e.buttons == 1){

		//if grid-item is active already
        if(this.classList.contains("active")){

			//remove it
            this.classList.remove("active")
			this.setAttribute("data-val", 0)

			//otherwise set active
        } else {
            this.classList.add("active");
			this.setAttribute("data-val", 1)
        }
    }
}
