var poi;
var showDelay = 180;
var poiMarkers = [];
var benchMarkers = [];
var activeInfoWindow = null;
var infoWindows = [];

$(function() {
    $.getJSON( "points-of-interest.json", {
        format: "json"
    }).done(function(json) {
      poi = json;
        for (var key in json) {
            var getKey = json[key];
            getKey.forEach(function(item) {
                var routesHTML = getRoutesHTML(item);
                $("#points-of-interest-info").before('<a data-toggle="tab" href="#selected-points-of-interest" onclick="selectedPoI(\'' +
                    item.number + '\', \'#points-of-interest\');"><div class="pointOfInterest card"><div class="poiPic"><img src="images/' + item.image +
                    '.thumbnail"/></div>' +
                    '<div class="cardText poiText"><b>' + item.name +
                    '</b><p>' + item.description + '</p>' + routesHTML +
                    '</div><div class="clear"></div></div></a>');

                var position = {lat: item.latitude, lng: item.longitude};
                poiMarkers.push(new google.maps.Marker({
                    position: position,
                    // icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
		            label: item.number,
                    map: map,
                    animation: google.maps.Animation.DROP
                }));
                infoWindows.push(new google.maps.InfoWindow({
                    content: '<a data-toggle="tab" href=#selected-points-of-interest onclick="selectedPoI(\'' + item.number + '\', \'#mapFrame\');">' + item.name + '</a>'
                }));
                var pointer = poiMarkers.length - 1;
                poiMarkers[poiMarkers.length-1].addListener('click', function() {
                    if (activeInfoWindow != null) {
                        infoWindows[activeInfoWindow].close();
                    }
                    console.log(activeInfoWindow);
                    infoWindows[pointer].open(map, poiMarkers[pointer]);
                    infoWindows[pointer].setMap(map);
                    activeInfoWindow = pointer;
                    console.log(activeInfoWindow);
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
                $("#trail-info").before('<div class="card"><div class="cardText">\
                    <div class="float half-width"><b><i class="fas fa-map-signs" style="color:' + item.color_hex + '"></i> ' + item.trail_colour + ' Route</b>\
                    </div><div class="float half-width text-right"><a data-toggle="tab" href="#mapFrame" onclick="showRoute(\'' + item.trail_colour + '\');" aria-expanded="false">\
                    <i class="fas fa-map" style="color:' + item.color_hex + '"></i> View on map</a><br></div>' +
                    'Length ' + item.length_KM + 'km (' + item.length_miles +' miles)\
                    <br><br><p>' + item.description + '</p></div></div>');
            });
        }
    });

    benchCoordinates.forEach(function(element) {
        var position = {lat: element.lat, lng: element.lng};
        benchMarkers.push(new google.maps.Marker({
            position: position,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue.png",
            size: new google.maps.Size(60, 100),
            animation: google.maps.Animation.DROP
        }));
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

function selectedPoI(number, link) {
    $(poi.points_of_interest).each(function(index, element) {
        if(element.number == number) {
            if (index == 0) {
                $("#poi-previous").hide();
                $("#poi-next").show();
                $("#poi-next").attr("onclick", "selectedPoI('" + poi.points_of_interest[index + 1].number + "', '" + link + "');");
            }
            else if (index == poi.points_of_interest.length - 1) {
                $("#poi-previous").show();
                $("#poi-next").hide();
                $("#poi-previous").attr("onclick", "selectedPoI('" + poi.points_of_interest[index - 1].number + "', '" + link + "');");
            }
            else {
                $("#poi-previous").show();
                $("#poi-next").show();
                $("#poi-previous").attr("onclick", "selectedPoI('" + poi.points_of_interest[index - 1].number + "', '" + link + "');");
                $("#poi-next").attr("onclick", "selectedPoI('" + poi.points_of_interest[index + 1].number + "', '" + link + "');");
            }

            $("#poi-heading").html('<a id="poi-back" data-toggle="tab" href="#points-of-interest" onclick="scrollToTop();showNavBar(true);"><i class="fas fa-angle-double-left"></i></a> ' + element.name);
            $("#poi-back").attr("href", link);
            $("#poi-name").html("Point of interest " + number);
            $("#poi-image").attr("src", 'images/' + element.image);
            var viewOnMapHTML = '<a data-toggle="tab" href="#mapFrame" onclick="clickMarker(poiMarkers[' + index + ']);showNavBar(true);$(\'#mapMenuItem\')" ><i class="fas fa-map"></i> View on map</a><br>';
            $("#poi-description").html(viewOnMapHTML + "<b>Route access: </b>" + getRoutesHTML(element) + "<br>" + element.description);
            showNavBar(false);
        }
    });
};

function showNavBar(show) {
    var x = document.getElementById("navigation-bar");
    setTimeout(function() {
        if (show) {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }, showDelay);
}

var map;
var pondMap;
var bluePath;
var redPath;
var yellowPath;
var greenPath;
var brownPath;
var overlayOn=true;
var gpsOptions = { timeout: 20000 };
var consecutiveLocationFails = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center:{lat: 51.2860, lng: -0.823845},
        zoom: 15
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

    $("#checkBoxInterests").click();
    $("#checkBoxBlue").click();
    $("#checkBoxYellow").click();
    $("#checkBoxRed").click();
    $("#checkBoxGreen").click();
    $("#checkBoxBrown").click();

    var userPositionGIF = new google.maps.Marker({
        map: map,
        icon: {
            url: 'images/location_pulse_50.gif',
            size: new google.maps.Size(50, 50),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(25, 25)
        }
    });

    userPositionGIF.setMap(map);
    updateGPSLocation(userPositionGIF);
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
    if (selectorElement.style.display == "none"){
        selectorElement.style.display = "block";
    }
    else {
        selectorElement.style.display = "none";
    }
    $("#iconShowHide").toggleClass("fa-angle-down");
    $("#iconShowHide").toggleClass("fa-angle-up");
}

function updateGPSLocation(userPosition) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log(pos.coords.latitude + "\n" + pos.coords.longitude);
            userPosition.setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude))
            setTimeout(function() { updateGPSLocation(userPosition); }, 3000);
        },
        function() {
            console.log("NOPE - timeout")
            consecutiveLocationFails += 1;
            if (consecutiveLocationFails < 100) {
                setTimeout(function() { updateGPSLocation(userPosition); }, 5000);
            }
            else {
                userPosition.setMap(null);
            }
        }, gpsOptions);
    }
    else {
        console.log("NOPE - unavailable");
        userPosition.setMap(null);
    }
}

function scrollToTop() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, showDelay);
}

function getRoutesHTML(item) {
    var routesHTML = ""
    item.routes.forEach(function(route) {
        routesHTML+='<i class="fas fa-map-signs ' + route + 'Route available-routes"></i>';
    });
    return routesHTML;
}

function showRoute(route) {
    $("#mapMenuItem").click();

    checkShowRoute("Blue", route);
    checkShowRoute("Yellow", route);
    checkShowRoute("Red", route);
    checkShowRoute("Green", route);
    checkShowRoute("Brown", route);
}

function checkShowRoute(route, shownRoute) {
    if ($('#checkBox' + route).prop('checked') != (route == shownRoute)) {
        $("#checkBox" + route).click();
    }
}

function toggleMarkers(markers, show) {
    for (i = 0; i < markers.length; i++) {
        console.log(markers[i])
        toggleMapItem(markers[i], show);
    }
}

function clickMarker(marker) {
    if (infoWindows[activeInfoWindow].getMap() != undefined) {
        google.maps.event.trigger(marker, 'click');
    }
}
