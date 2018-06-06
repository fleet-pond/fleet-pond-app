var showDelay = 180;
var poiMarkers = [];
var benchMarkers = [];
var activeInfoWindow = null;
var infoWindows = [];
var gpsLocation = null;
var initialCenter = {lat: 51.2860, lng: -0.823845};
var initialZoom = 15;
var routePics = {};
var watchLocation;
var trackLocation = false;
var online = true;
var gallerySlideshow = true;
var cardStart = '<div class="card"><div class="cardText">';
var cardEnd = '</div></div>';
var gallerySliderHTML = '';
var galleryListHTML = '';
var gpsAccuracy;
var gpsSuccess;

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
            keyPics = shuffleArray(routePics[item.trail_colour.toLowerCase()]);
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
    gallery = shuffleArray(gallery.gallery);
    gallery.forEach(function(picture) {
        galleryListHTML += '<div class="card"><img style="max-width:100%;width:100%;" src="images/' + picture.src + '"/>';
        var pictureText = "";
        if ('name' in picture) {
            pictureText += '<b>Taken by:</b> ' + picture.name
        }
        if ('title' in picture) {
            pictureText += '<br/><b>Title:</b> ' + picture.title
        }
        if ('description' in picture) {
            pictureText += '<br/><b>Description:</b> ' + picture.description
        }

        if (pictureText != "") {
            pictureText = '<div class="cardText">' + pictureText + '</div>';
    }
        galleryListHTML += pictureText + '</div>';
    });
    gallerySliderHTML = "<div class='card'>" + generateSlideshowHTML(gallery, "gallerySlider") + "</div>";
    updateGalleryContent();

    $('#zoom-in').click(function () {
        $('#pond-map').width($('#pond-map').width()*1.2)
        $('#pond-map').height($('#pond-map').height()*1.2)
    });
    $('#zoom-out').click(function () {
        $('#pond-map').width($('#pond-map').width()/1.2)
        $('#pond-map').height($('#pond-map').height()/1.2)
    });
});

function updateGalleryContent() {
    var slideshowSelector = '<br/><br/><div class="text-center"><button type="button" class="btn btn-success" id="galleryButton" onclick="toggleGallery()">View images as list</button></div>';
    var galleryDiv = '<div id="galleryPictures">' + gallerySliderHTML + '</div>'
    var galleryContent = '<h1>Gallery</h1>' + cardStart + galleryCurrentText + cardEnd +
    cardStart + galleryNextText + slideshowSelector + cardEnd + galleryDiv;
    $('#gallery').html(galleryContent);
}

function toggleGallery() {
    gallerySlideshow = !gallerySlideshow;
    if (gallerySlideshow) {
        $('#galleryButton').text("View images as list");
        $('#galleryPictures').html(gallerySliderHTML);
    }
    else {
        $('#galleryButton').text("View images as slideshow");
        $('#galleryPictures').html(galleryListHTML);
    }
}

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

        var picSrc = picsArray[i];
        var picDescription = "";
        if (typeof picsArray[i] != "string") {
            picDescription = "Photo by "
            picSrc = picsArray[i].src;
            if ('title' in picsArray[i]) {
                picDescription = "'" + picsArray[i].title + "' by ";
            }
            picDescription += picsArray[i].name;
        if (picDescription != "Photo by ") {
            picDescription = '<div class="carousel-caption d-none d-md-block"><h4>' + picDescription + '</h4></div>';
        }
        }
        wrappers += '<div class="item ' + active + '"><img src="images/' + picSrc + '" alt="Picture ' + i + '" style="max-width:100%;width:100%;">' + picDescription + '</div>';
    }

    indicators += '</ol>';
    wrappers += '</div>';

    if (picsArray.length > 1) {
        controls = '<a class="left carousel-control" href="#' + id + '" data-slide="prev">\
            <span class="glyphicon glyphicon-chevron-left slider-control"></span>\
            <span class="sr-only">Previous</span></a>\
            <a class="right carousel-control" href="#' + id + '" data-slide="next">\
            <span class="glyphicon glyphicon-chevron-right slider-control"></span>\
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
            var viewOnMapHTML = "";
            if (online) {
                viewOnMapHTML = '<a data-toggle="tab" href="#mapFrame" onclick="clickMarker(poiMarkers[' + index + ']);showNavBar(true);$(\'#mapMenuItem\')" ><i class="fas fa-map"></i> View on map</a><br>';
            }
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
var gpsOptions = { enableHighAccuracy: true, timeout: 10000 };
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

    if ("geolocation" in navigator) {
        var color = '#3498DB';
        var color2 = '#FFF';
        gpsAccuracy = new google.maps.Circle({
            map: map,
            fillColor: color,
            fillOpacity: 0.2,
            strokeColor: color,
            strokeOpacity: 1.0
        });

        gpsCenter = new google.maps.Marker({
            map: map,
            title: "userLocation",
            icon: {
                strokeColor: color2,
                strokeOpacity: 1.0,
                strokeWeight: 3,
                fillColor: color,
                fillOpacity: 1.0,
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                anchor: new google.maps.Point(0, 0)
            }
        });

        getInitialGPS();
    }

    google.maps.event.addListener(map, 'zoom_changed', function() {
        var zoom = map.getZoom();
        if (zoom <= 12) {
            updatePathWidths({strokeWeight: 1});
        }
        else if (zoom <= 14) {
            updatePathWidths({strokeWeight: 2});
        }
        else if (zoom <= 15) {
            updatePathWidths({strokeWeight: 3});
        }
        else if (zoom <= 16) {
            updatePathWidths({strokeWeight: 4});
        }
        else if (zoom <= 18) {
            updatePathWidths({strokeWeight: 6});
        }
        else if (zoom <= 19) {
            updatePathWidths({strokeWeight: 8});
        }
        else {
            updatePathWidths({strokeWeight: 10});
        }
    });
}

function updateGPSMarkerPosition(gpsAccuracy, gpsCenter, pos) {
    acc = parseInt(pos.coords.accuracy);
    lat = parseFloat(pos.coords.latitude);
    lng = parseFloat(pos.coords.longitude);
    gpsAccuracy.setCenter(new google.maps.LatLng(lat, lng));
    gpsAccuracy.setRadius(acc);
    gpsCenter.setPosition(new google.maps.LatLng(lat, lng));
    $(".gps-buttons").css('display', 'inline-block');
    gpsLocation = {lat: lat, lng: lng};
    consecutiveLocationFails = 0;
    if (trackLocation && (acc < 150)) {
        goToGPS();
    }
}

function getInitialGPS() {
    navigator.geolocation.getCurrentPosition(initialGPSSuccess(gpsAccuracy, gpsCenter), initialGPSError, gpsOptions);
}

function initialGPSSuccess(gpsAccuracy, gpsCenter) {
    return function(pos) {
        console.log(pos);
        updateGPSMarkerPosition(gpsAccuracy, gpsCenter, pos);
        watchLocation = navigator.geolocation.watchPosition(onGPSSuccess(gpsAccuracy, gpsCenter), onGPSError, gpsOptions);
    }
}

function initialGPSError(error) {
    setTimeout(function() {
        getInitialGPS();
    }, 5000);
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

function onGPSSuccess(gpsAccuracy, gpsCenter) {
    return function(pos) {
        console.log("watch");
        console.log(pos);
        updateGPSMarkerPosition(gpsAccuracy, gpsCenter, pos);
    }
}

function onGPSError(gpsAccuracy, gpsCenter) {
    return function(error) {
        console.log("Get location error:");
        console.log(error);
        if ((consecutiveLocationFails > 9) || (error.code == 1)) {
            console.log("Disabling gps tracking.")
            navigator.geolocation.clearWatch(watchLocation);
            gpsAccuracy.setMap(null);
            gpsCenter.setMap(null);
            $("#goToGPS").css('display', 'none');
            setTimeout(function() {
                watchLocation = navigator.geolocation.watchPosition(onGPSSuccess(gpsAccuracy, gpsCenter), onGPSError, gpsOptions);
            }, 5000);
        }
        else {
            consecutiveLocationFails += 1;
        }
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

    if (online) {
        checkShowRoute("Blue", route);
        checkShowRoute("Yellow", route);
        checkShowRoute("Red", route);
        checkShowRoute("Green", route);
        checkShowRoute("Brown", route);
    }
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

function toggleLockGPS() {
    $('#lockGPSIcon').toggleClass('fa-lock-open');
    $('#lockGPSIcon').toggleClass('fa-lock');
    trackLocation = !trackLocation;
}

function goToGPS() {
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

function updatePathWidths(strokeOptions) {
    bluePath.setOptions(strokeOptions);
    yellowPath.setOptions(strokeOptions);
    redPath.setOptions(strokeOptions);
    greenPath.setOptions(strokeOptions);
    brownPath.setOptions(strokeOptions);
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

function offlineMode() {
    online = false;
    console.log("Offline mode activated.");

    $('#panelShowHide').css('display', 'none');

    var offlineButtonHTML = '<button id="offlineZoomIn" onclick="offlineMapZoomChange(3/2);"><i class="fas fa-plus"></i></button><br>\
                <button id="offlineZoomOut" onclick="offlineMapZoomChange(2/3);"><i class="fas fa-minus"></i></button>';

    $('#moveMap').css('bottom', "84px");
    $('#moveMap').html(offlineButtonHTML);

    // add map to map page
    $('#map').toggleClass('offline-map');
    $('#map').html('<img id="map-image" src="images/fleet-pond-map-with-brown_green_routes.jpg" />');

    $("#map-image").on('load', function() { setMapImageHeight(500); });
}

function offlineMapZoomChange(zoomChange) {
    setMapImageHeight(parseInt($('#map-image').css('height')) * zoomChange);
}

function setMapImageHeight(newHeight) {
    // get current x and y scroll center
    var xCenter = 0.5;
    var yCenter = 0.5;

    var initScrollX = $('#map').scrollLeft();
    var initImageX = $('#map-image').width();
    var initContainerX = $('#map').width();

    var initScrollY = $('#map').scrollTop();
    var initImageY = $('#map-image').height();
    var initContainerY = $('#map').height();

    if (initImageX > initContainerX) {
        xCenter = (initScrollX + (initContainerX / 2)) / initImageX;
    }

    if (initImageY > initContainerY) {
        yCenter = (initScrollY + (initContainerY / 2)) / initImageY;
    }

    $('#map-image').css('height', newHeight+"px");

    // set new x and y scroll center
    var postImageX = $('#map-image').width();
    var postContainerX = $('#map').width();

    var postImageY = $('#map-image').height();
    var postContainerY = $('#map').height();

    var newScrollX = (xCenter * postImageX) - (postContainerX / 2);
    var newScrollY = (yCenter * postImageY) - (postContainerY / 2);

    $('#map').scrollLeft(newScrollX);
    $('#map').scrollTop(newScrollY);

    centerMapImagePadding();
}

function centerMapImagePadding() {
    imageHeight = $('#map-image').height();
    divHeight = $('#map').height();
    var newMarginTop = '0';
    if (imageHeight < divHeight) {
        newMarginTop = ((divHeight-imageHeight)/2) + 'px';
    }
    $('#map-image').css('margin-top', newMarginTop);
}
