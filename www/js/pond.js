var poi;
$(function() {
    $.getJSON( "points-of-interest.json", {
        format: "json"
    }).done(function(json) {
      poi = json;
        for (var key in json) {
            var getKey = json[key];
            getKey.forEach(function(item) {
                var routesHTML = "";
                item.routes.forEach(function(route) {
                    routesHTML+='<i class="fas fa-map-signs ' + route + 'Route"></i>';
                });
                $("#points-of-interest-info").before('<div class="pointOfInterest">' +
                    '<div class="poiText"><a data-toggle="tab" ' +
                    'href=#selected-points-of-interest onclick="selectedPoI(\'' +
                    item.number + '\');">' + item.number + '&#09; - ' + item.name +
                    '</a><p>' + item.description + '</p>' + routesHTML +
                    '</div><div class="poiPic"><img src="images/' + item.image +
                    '"/></div><div class="clear"</div></div>');



                var position = {lat: item.latitude, lng: item.longitude};
                var marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    animation: google.maps.Animation.DROP
                });
                var infoWindow = new google.maps.InfoWindow({
                    content: item.name
                    //content: '<a href="#selected-points-of-interest" onclick="selectedPoI(' + item.number + ')">' + item.name + '</a>'
                });
                marker.addListener('click', function() {
                    infoWindow.open(map, marker);
                })
            });
        }
    });

    $.getJSON( "trails.json", {
        format: "json"
    }).done(function(json) {
        for (var key in json){
            var getKey = json[key];
            getKey.forEach(function(item){
                $("#trail-info").before('<b><i class="fas fa-map-signs" style="color:' +
                    item.color_hex + '"></i> ' + item.trail_colour + ' Route</b><br>' +
                    'Length ' + item.length_KM + 'km (' + item.length_miles +
                    ' miles)<br><br><p>' + item.description + '</p><hr>');
            });
        }
    });

	$('#zoom-in').click(function () {
        $('#pond-map').width($('#pond-map').width()*1.2)
        $('#pond-map').height($('#pond-map').height()*1.2)
    })
    $('#zoom-out').click(function () {
        $('#pond-map').width($('#pond-map').width()/1.2)
        $('#pond-map').height($('#pond-map').height()/1.2)
    })
});

function selectedPoI(number) {
    $(poi.points_of_interest).each(function(index, element) {
        if(element.number == number) {
            $("#poi-heading").html(element.name);
            $("#poi-name").html('Point of Interest ' + number);
            $("#poi-image").attr("src", 'images/' + element.image);
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

var map;
var pondMap;
var bluePath;
var redPath;
var yellowPath;
var greenPath;
var brownPath;
var overlayOn=true;
var gpsOptions = { timeout: 10000 };

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center:{lat: 51.2860, lng: -0.823845},
        zoom: 15
    });

    userPosition = new google.maps.Circle({
        strokeColor: '#4E4',
        strokeOpacity: 1,
        strokeWeight: 6,
        fillColor: '#4E4',
        fillOpacity: 1,
        radius: 8
    });

    bluePath = new google.maps.Polyline({
        path: bluePathCoodinates,
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 11
    });

    yellowPath = new google.maps.Polyline({
        path: yellowPathCoodinates,
        geodesic: true,
        strokeColor: '#EEEE44',
        strokeOpacity: 1.0,
        strokeWeight: 6
    });

    redPath = new google.maps.Polyline({
        path: redPathCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });

    greenPath = new google.maps.Polyline({
        path: greenPathCoordinates,
        geodesic: true,
        strokeColor: '#008000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });

    brownPath = new google.maps.Polyline({
        path: brownPathCoordinates,
        geodesic: true,
        strokeColor: '#8B4513',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });


    var imageBounds = {
        north: 51.292000,
        south: 51.2820,
        east: -0.815100,
        west: -0.833800
    };

    pondMap = new google.maps.GroundOverlay(
        'http://www.fleetpond.fccs.org.uk/fpmap14.jpg',
        imageBounds);
    pondMap.setOpacity(0.6);

    $(function() {
        $.getJSON( "points-of-interest.json", {
            format: "json"
        }).done(function(json) {
          poi = json;

        });
    });


    bluePath.setMap(map);
    yellowPath.setMap(map);
    redPath.setMap(map);
    greenPath.setMap(map);
    brownPath.setMap(map);

    updateGPSLocation(userPosition);
    userPosition.setMap(map);
}

function toggleMapItem(item, show) {
    if (show) {
        item.setMap(map);
    }
    else {
        item.setMap(null);
    }
}

function toggleSelector() {
    var selectorElement = document.getElementById("mapSelector");
    var buttonElement = document.getElementById("selectorButton")
    if (selectorElement.style.display == "none"){
        selectorElement.style.display = "block";
        buttonElement.innerHTML = "Hide";
    }
    else {
        selectorElement.style.display = "none";
        buttonElement.innerHTML = "Show";
    }
}

function updateGPSLocation(userPosition) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            userPosition.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude))
            setTimeout(function() { updateGPSLocation(userPosition); }, 5000);
        },
        function() {
            console.log("NOPE - timeout")
            userPosition.setMap(null);
        }, gpsOptions);
    }
    else {
        console.log("NOPE - unavailable");
        userPosition.setMap(null);
    }
}
