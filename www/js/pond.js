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
            $("#poi-heading").html('Point of Interest ' + number);
            $("#poi-name").html(element.name);
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


    
