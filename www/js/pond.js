var showDelay = 180;
var poiMarkers = [];
var benchMarkers = [];
var activeInfoWindow = null;
var infoWindows = [];
var gpsLocation = null;
var initialCenter = {lat: 51.2860, lng: -0.823845};
var initialZoom = 15;
var routePics = {};

$(function() {
    for (var key in poi) {
        var getKey = poi[key];
        getKey.forEach(function(item) {
            var routesHTML = getRoutesHTML(item);
            $("#points-of-interest-info").before('<a data-toggle="tab" href="#selected-points-of-interest" onclick="selectedPoI(\'' +
                item.number + '\', \'#points-of-interest\');"><div class="pointOfInterest card"><div class="poiPic"><img src="images/' +
                item.thumbnail + '"/></div>' +
                '<div class="cardText poiText"><b>' + item.name +
                '</b><p>' + item.description + '</p>' + routesHTML +
                '</div><div class="clear"></div></div></a>');

            item.routes.forEach(function(route) {
                if (routePics[route] == undefined) {
                    routePics[route] = [];
                }
                if (item.image[0] != "image-placeholder.png") {
                    for (var i = 0; i < item.image.length; i++) {
                        routePics[route].push(item.image[i]);
                    }
                }
            })
        });
    }

    for (var key in trails) {
        var getKey = trails[key];
        getKey.forEach(function(item){
            keyPics = shuffleArray(routePics[item.trail_colour.toLowerCase()])
            $("#trail-info").before('<div class="card"><div class="cardText">\
                <div class="float half-width"><b><i class="fas fa-map-signs" style="color:' + item.color_hex + '"></i> ' + item.trail_colour + ' Route</b>\
                </div><div class="float half-width text-right"><a data-toggle="tab" href="#mapFrame" onclick="showRoute(\'' + item.trail_colour + '\');" aria-expanded="false">\
                <i class="fas fa-map" style="color:' + item.color_hex + '"></i> View on map</a><br></div>' +
                'Length ' + item.length_KM + 'km (' + item.length_miles +' miles)\
                <br><br><p>' + item.description + '</p></div>\
                <div id="' + item.trail_colour + '-route-image-container">\
                ' + generateSlideshowHTML(keyPics, item.trail_colour + '-image-slides') + '</div></div>');
        });
    }

    $('#zoom-in').click(function () {
        $('#pond-map').width($('#pond-map').width()*1.2)
        $('#pond-map').height($('#pond-map').height()*1.2)
    });
    $('#zoom-out').click(function () {
        $('#pond-map').width($('#pond-map').width()/1.2)
        $('#pond-map').height($('#pond-map').height()/1.2)
    });
});

function generateSlideshowHTML(picsArray, id) {
    var startHTML = '<div id="' + id + '" class="carousel slide" data-ride="carousel">';
    var indicators = '<ol class="carousel-indicators">';
    var wrappers = '<div class="carousel-inner">';
    var controls = '';

    for (var i = 0; i < picsArray.length; i++) {
        var active = '';
        if (i == 0) {
            active = 'active';
    }

        indicators += '<li data-target="#' + id + '" data-slide-to="' + i + '" class="' + active + '"></li>';

        wrappers += '<div class="item ' + active + '"><img src="images/' + picsArray[i] + '" alt="Picture ' + i + '" style="width:100%;"></div>';
    }

    indicators += '</ol>';
    wrappers += '</div>';

    if (picsArray.length > 1) {
        controls = '<a class="left carousel-control" href="#' + id + '" data-slide="prev">\
            <span class="glyphicon glyphicon-chevron-left"></span>\
            <span class="sr-only">Previous</span></a>\
            <a class="right carousel-control" href="#' + id + '" data-slide="next">\
            <span class="glyphicon glyphicon-chevron-right"></span>\
            <span class="sr-only">Next</span></a>';
    }

    // startHTML + indicators + wrappers + controls + '</div>'
    var sliderHTML = startHTML + wrappers + controls + '</div>'
    return sliderHTML;
}

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
            $("#poi-image-container").html(generateSlideshowHTML(element.image, 'poi-image-slides'));
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
        center: initialCenter,
        zoom: initialZoom
    });

    bluePath = createPath(bluePathCoordinates, '#0000FF');
    yellowPath = createPath(yellowPathCoordinates, '#EEEE44');
    redPath = createPath(redPathCoordinates, '#FF0000');
    greenPath = createPath(greenPathCoordinates, '#008000');
    brownPath = createPath(brownPathCoordinates, '#8B4513');

    var imageBounds = {
        north: 51.292000,
        south: 51.2820,
        east: -0.815100,
        west: -0.833800
    };

    addMarkers();

    pondMap = new google.maps.GroundOverlay(
        'http://www.fleetpond.fccs.org.uk/fpmap14.jpg',
        imageBounds);
    pondMap.setOpacity(0.6);

    $("#checkBoxOverlay").click();
    $("#checkBoxInterests").click();
    $("#checkBoxBenches").click();
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

    google.maps.event.addListener(map, 'zoom_changed', function() {
        var zoom = map.getZoom();
        console.log(zoom);
        if (zoom <= 12) {
            updatePathWidths(1);
        }
        else if (zoom <= 14) {
            updatePathWidths(2);
        }
        else if (zoom <= 15) {
            updatePathWidths(3);
        }
        else if (zoom <= 16) {
            updatePathWidths(4);
        }
        else if (zoom <= 18) {
            updatePathWidths(6);
        }
        else if (zoom <= 19) {
            updatePathWidths(8);
        }
        else {
            updatePathWidths(10);
        }
    });
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
            $("#goToGPS").css('display', 'inline-block');
            gpsLocation = {lat: pos.coords.latitude, lng: pos.coords.longitude};
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
        toggleMapItem(markers[i], show);
    }
}

function clickMarker(marker) {
    $("#mapMenuItem").click();
    if (marker != undefined) {
        google.maps.event.trigger(marker, 'click');
    }
}

function resetMap() {
    map.setCenter(initialCenter);
    map.setZoom(initialZoom);
}

function goToGPS() {
    console.log(gpsLocation);
    if (gpsLocation != null) {
        map.setCenter(gpsLocation);
    }
}

function createPath(pathCoordinates, color) {
    var newPath = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 4
    });
    return newPath;
}

function updatePathWidths(strokeWeight) {
    bluePath.setOptions({strokeWeight: strokeWeight});
    yellowPath.setOptions({strokeWeight: strokeWeight});
    redPath.setOptions({strokeWeight: strokeWeight});
    greenPath.setOptions({strokeWeight: strokeWeight});
    brownPath.setOptions({strokeWeight: strokeWeight});
}

function addMarkers() {
    for (var key in poi) {
        var getKey = poi[key];
        getKey.forEach(function(item) {
            var position = {lat: item.latitude, lng: item.longitude};
            poiMarkers.push(new google.maps.Marker({
                position: position,
                label: item.number,
                map: map,
                animation: google.maps.Animation.DROP
            }));
            infoWindows.push(new google.maps.InfoWindow({
                content: '<a data-toggle="tab" href=#selected-points-of-interest onclick="selectedPoI(\'' + item.number + '\', \'#mapFrame\');">' + item.name + '</a>'
            }));
            var pointer = poiMarkers.length - 1;
            poiMarkers[pointer].addListener('click', function() {
                console.log(activeInfoWindow);
                if (activeInfoWindow != null) {
                    infoWindows[activeInfoWindow].close();
                }
                infoWindows[pointer].open(map, poiMarkers[pointer]);
                infoWindows[pointer].setMap(map);
                activeInfoWindow = pointer;
            })
        });
    }

    benchCoordinates.forEach(function(element) {
        var position = {lat: element.lat, lng: element.lng};
        benchMarkers.push(new google.maps.Marker({
            position: position,
            icon: "images/bluePin.png",
            map: map
        }));
    });
}

function shuffleArray(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
