document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("name").addEventListener("change", function () {
        document.getElementById("hiddenName").value = document.getElementById("name").value;
    })

})

function showIndexName() {
	document.getElementById("landingSection").style.display = "none";
	document.getElementById("joinSection").style.display = "none";
	document.getElementById("login").style.display = "none";
	document.getElementById("date").style.display = "none";
    document.getElementById("nameSection").style.display = "block";
}

function showIndexDate() {
	document.getElementById("landingSection").style.display = "none";
	document.getElementById("joinSection").style.display = "none";
	document.getElementById("login").style.display = "none";
    document.getElementById("nameSection").style.display = "none";
	document.getElementById("date").style.display = "block";
    document.getElementById("greetingNameSpan").innerText = document.getElementById("name").value;
}

function showName() {
	document.getElementById("landingSection").style.display = "none";
	document.getElementById("nameSection").style.display = "block";
	document.getElementById("Calendar").style.display = "none";
}

//add name section
//relink button to show name not date
//make name button show date instead