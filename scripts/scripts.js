document.addEventListener("DOMContentLoaded", function(){

    dateTimes = document.getElementsByClassName("dateTime");

    for(i=0; i < dateTimes.length; i++)
    {
        dateTimes[i].addEventListener('mouseover', setActive, false);
        dateTimes[i].addEventListener('mousedown', setActive, false);
    }

    populateDate = document.getElementsByClassName("dateTime2");

    for(i = 0; i < populateDate.length; i++)
    {
      // POPULATE EACH DATE ITERATIVELY - IF 1 -> SET ACTIVE
    }

});


function setActive(e) {
    if(e.buttons == 1){
        if(this.classList.contains("active")){
            this.classList.remove("active")
        } else {
            this.classList.add("active");
        }
    }
}
