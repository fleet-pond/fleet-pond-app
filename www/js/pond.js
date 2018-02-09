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
        for (var key in json) {
          var getKey = json[key];
          getKey.forEach(function(item) {
            $("#points-of-interest-info").before('<a data-toggle="tab"' +
            ' href=#selected-points-of-interest' +
            ' onclick="selectedPoI(' + item.number + ');">' +
            '<i class="fas fa-map-marker-alt"></i>' + item.number + '</a><br>');
          });
        }
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
            $("#poi-heading").html('Point of Interest ' + number);
            $("#poi-name").html(element.name);
            $("#poi-image").attr("src", '../images/' + element.image);
            $("#poi-description").html(element.description);
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

$(document).ready(function() {
    $('#zoom-in').click(function () {
        $('#pond-map').width($('#pond-map').width()*1.2)
        $('#pond-map').height($('#pond-map').height()*1.2)
    })
    $('#zoom-out').click(function () {
        $('#pond-map').width($('#pond-map').width()/1.2)
        $('#pond-map').height($('#pond-map').height()/1.2)
    })
});
