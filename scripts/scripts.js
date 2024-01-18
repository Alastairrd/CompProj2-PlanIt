document.addEventListener("DOMContentLoaded", function(){

    dateTimes = document.getElementsByClassName("dateTime");

    for(i=0; i < dateTimes.length; i++){
        dateTimes[i].addEventListener('mouseover', setActive, false);
        dateTimes[i].addEventListener('mousedown', setActive, false);
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

