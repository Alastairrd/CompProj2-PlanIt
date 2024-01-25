
//Function fires when page is loaded
document.addEventListener("DOMContentLoaded", function(){

    //get all dateTime elements from index.html
    dateTimes = document.getElementsByClassName("dateTime");

    //add mousedown and mouseover event listeners to every dateTime element, which fires the setActive function
    for(i=0; i < dateTimes.length; i++){
        dateTimes[i].addEventListener('mouseover', setActive, false);
        dateTimes[i].addEventListener('mousedown', setActive, false);
    }
});

//if dateTime element detects mousedown or mouseover
function setActive(e) {
    //it checks if the left mouse button is currently down
    if(e.buttons == 1){

        //if element is already active, remove active (css class)
        if(this.classList.contains("active")){
            this.classList.remove("active")

            //otherwise, make active (css class)
        } else {
            this.classList.add("active");
        }
    }
}

