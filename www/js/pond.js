var gpsPosDiv = document.getElementById("gpsPos");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        gpsPosDiv.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    gpsPosDiv.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
}