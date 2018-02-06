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

var poi;
$(function() {
    $.getJSON( "../points-of-interest.json", {
        format: "json"
    }).done(function(json) {
        poi = json;
    });
});

$(function() {
    $.getJSON( "../trails.json", {
        format: "json"
    }).done(function(json) {
        for (var key in json){
            var getKey = json[key];
            getKey.forEach(function(item){
                $("#trail-info").after('<b><i class="far fa-map"></i> ' + item.trail_colour + ' Route</b><br>' +
                    'Length ' + item.length_KM + 'km (' + item.length_miles + ' miles)<br><br>' +
                    '<p>' + item.description + '</p>' +
                    '<hr>');
            });
        }
    });
});

function selectedPoI(number) {
    $(poi.points_of_interest).each(function(index, element) {
        if(element.number == number) {
            document.getElementById("poi-description").innerHTML = element.description;
            document.getElementById("poi-heading").innerHTML = 'More about #' + number;
            showOrHide();
        }
    });
};

function showOrHide() {
    var x = document.getElementById("navigation-bar");
    if ($("#selected-points-of-interest").hasClass("active")) {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}