var poi;
$(function() {
    $.getJSON( "points-of-interest.json", {
        format: "json"
    }).done(function(json) {
      poi = json;
        for (var key in json) {
            var getKey = json[key];
            getKey.forEach(function(item) {
                var routesHTML = getRoutesHTML(item);
                $("#points-of-interest-info").before('<a data-toggle="tab" href=#selected-points-of-interest onclick="selectedPoI(\'' +
                    item.number + '\', \'#points-of-interest\');"><div class="pointOfInterest card"><div class="poiPic"><img src="images/' + item.image +
                    '.thumbnail"/></div>' +
                    '<div class="cardText poiText"><b>' + item.name +
                    '</b><p>' + item.description + '</p>' + routesHTML +
                    '</div><div class="clear"></div></div></a>');

                var position = {lat: item.latitude, lng: item.longitude};
                var marker = new google.maps.Marker({
                    position: position,
		            label: item.number,
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
                $("#trail-info").before('<div class="card"><div class="cardText">\
                    <div class="float half-width"><b><i class="fas fa-map-signs" style="color:' + item.color_hex + '"></i> ' + item.trail_colour + ' Route</b>\
                    </div><div class="float half-width text-right"><a data-toggle="tab" href="#mapFrame" onclick="showRoute(\'' + item.trail_colour + '\');" aria-expanded="false">\
                    <i class="fas fa-map" style="color:' + item.color_hex + '"></i> View on map</a><br></div>' +
                    'Length ' + item.length_KM + 'km (' + item.length_miles +' miles)\
                    <br><br><p>' + item.description + '</p></div></div>');
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

function selectedPoI(number, link) {
    $(poi.points_of_interest).each(function(index, element) {
        if(element.number == number) {
            if (index == 0) {
                $("#poi-previous").hide();
                $("#poi-next").show();
                $("#poi-next").attr("href", "javascript:selectedPoI('" + poi.points_of_interest[index + 1].number + "');");
            }
            else if (index == poi.points_of_interest.length - 1) {
                $("#poi-previous").show();
                $("#poi-next").hide();
                $("#poi-previous").attr("href", "javascript:selectedPoI(" + poi.points_of_interest[index - 1].number + ");");
            }
            else {
                $("#poi-previous").show();
                $("#poi-next").show();
                $("#poi-previous").attr("href", "javascript:selectedPoI('" + poi.points_of_interest[index - 1].number + "');");
                $("#poi-next").attr("href", "javascript:selectedPoI('" + poi.points_of_interest[index + 1].number + "');");
            }

            $("#poi-heading").html('<a id="poi-back" data-toggle="tab" href="#points-of-interest" onclick="scrollToTop();showOrHide();"><i class="fas fa-angle-double-left"></i></a> ' + element.name);
            $("#poi-back").attr("href", link);
            $("#poi-name").html("Point of interest " + number);
            $("#poi-image").attr("src", 'images/' + element.image);
            $("#poi-description").html("<b>Route access: </b>" + getRoutesHTML(element) + "<br>" + element.description);
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


    $("#checkBoxBlue").click();
    $("#checkBoxYellow").click();
    $("#checkBoxRed").click();
    $("#checkBoxGreen").click();
    $("#checkBoxBrown").click();

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

function scrollToTop() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 180);
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
