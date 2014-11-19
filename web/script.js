var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var geocoder;
var lats = [];
var lngs = [];
var names = [];
var descriptions = [];
var relate_costs = [];
var links = [];
var select = 0;
var markers = [];
var apiKeys = ["AIzaSyDiEtqOtMKrFTOkPKdexB0djGKXfxy6xbM", "AIzaSyAx9vHjNSgd_AuinvDEOn2sMLxppHEG4tM", "AIzaSyAU0VPFAnKpOwSmzt5IN6tJ6ImdopSenOw", "AIzaSyBC0mmW5Hk0oH0D-P7rRTuFqG07FhmkSDQ"];
var times = [];
var taxi = [];
var distances = [];
var place_ids = [];
var routes = [];
var userlat;
var userlng;

//start initalize
function initialize() {
    //about map
    geocoder = new google.maps.Geocoder();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(13.7262461, 100.5182432)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    var control = document.getElementById('control');
    control.style.display = 'block';
    //map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    var input = /** @type {HTMLInputElement} */(
            document.getElementById('start'));
    var input2 = /** @type {HTMLInputElement} */(
            document.getElementById('end'));

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var autocomplete = new google.maps.places.Autocomplete(input2);
    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
    });
}
//end of initailize


//start set direction
function calcRoute(lat, lng) {
    var start = document.getElementById('start').value;
    var end = '(' + lat + ',' + lng + ')';
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: true,
        avoidTolls: true
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            alert("service fail");
        }
    });
    loaded;
}
//end set directtion


//get current location
function getCurrentLocation() {
    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);
            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'You',
                maxWidth: 200
            });
            map.setZoom(11);
            map.setCenter(pos);
            document.getElementById('start').value = pos;
        }, function () {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}
function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
        alert(content);
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
        alert(content);
    }
    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };
    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}
//end get current location

function onSelect(i) {
    select = i;
    calcRoute(lats[select], lngs[select]);
    setInfo();
}


var infowindow = null;
//set marker
function marker(lat, lng, title, number, pic) {
    var myLatlng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: title,
        icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + number + "|FF0000|000000"
    });

    google.maps.event.addListener(marker, 'click', function () {
        document.getElementById('end').value = title;
        select = number;
        if (infowindow != null)
            infowindow.close();
        infowindow = new google.maps.InfoWindow({
            content: '<strong>' + title + '</strong>' + '<br><center> <img src=' + pic + ' width=200></center>'
        });
        infowindow.open(map, marker);
        map.setCenter(myLatlng);
    });

    markers.push(marker);
}
//end marker


//set desciption & picture
function setInfo() {
    var text = descriptions[select] + "<br> ค่าเข้าโดยประมาณ : " + relate_costs[select] + "บาท/คน";
    document.getElementById("textInPicDis").innerHTML = text;
    document.getElementById("end").value = names[select];
    document.getElementById("picLocate").style.backgroundImage = "url(" + links[select] + ")";
}
//end desciption & picture

function delInput(id) {
    document.getElementById(id).value = "";

}

//set end
function setEnd() {
    document.getElementById('end').value = names[select];
}

function loading() {
    document.getElementById("textInPicDis").innerHTML = "loading . . .";
    document.getElementById("picLocate").style.backgroundImage = "url(img/spinner.gif)";
    document.getElementById('submit').value = "กำลังค้นหา";
    document.getElementById('submit').disabled = true;
}

function reset() {
    document.getElementById("recBox").innerHTML = "load";
    deleteMarkers();
    routes.length = 0;
    lats.length = 0;
    lngs.length = 0;
    names.length = 0;
    descriptions.length = 0;
    relate_costs.length = 0;
    links.length = 0;
    select = 0;
    markers.length = 0;
    times.length = 0;
    taxi.length = 0;
    distances.length = 0;
    loading();
    findPlaces();
}

function locationByUser() {
    var address = document.getElementById('start').value;
    console.log(address);
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (infowindow != null) {
                infowindow.close();
            }
            userlat = results[0].geometry.location.k;
            userlng = results[0].geometry.location.B;
            var pos = new google.maps.LatLng(results[0].geometry.location.k, results[0].geometry.location.B);
            console.log("(" + results[0].geometry.location.k + "," + results[0].geometry.location.B + ")");
            infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Start',
                maxWidth: 200
            });
            map.setCenter(pos);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


var number;
function findPlaces() {
    var count;
    var address = document.getElementById('start').value;
    var radius = document.getElementById('radius').value;
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.k;
            var lng = results[0].geometry.location.B;
            var request = 'messenger?cmd=radius&lat=' + lat + '&lng=' + lng + '&r=' + radius;
            jQuery.getJSON(request, function (place) {
                number = place.array.length;
                if (place.array.length != 0) {
                    for (count = 0; count < place.array.length; count++) {
                        var dest = "(" + place.array[count].lat + "," + place.array[count].lng + ")";
                        var src = "(" + lat + "," + lng + ")";
                        var requestDistance = "https://maps.googleapis.com/maps/api/directions/json?origin=" + src + "&destination=" + dest + "&avoid=tolls|highways&key=" + apiKeys[count % apiKeys.length];
                        requestDirection(requestDistance);
                        routeFromUser(lat, lng, place.array[count].place_id, count);
                        place_ids.push(place.array[count].place_id);
                        lats.push(place.array[count].lat);
                        lngs.push(place.array[count].lng);
                        names.push(place.array[count].name);
                        descriptions.push(place.array[count].description);
                        relate_costs.push(place.array[count].related_cost);
                        links.push(place.array[count].link);
                    }
                } else {
                    alert("ไม่ที่ให้คุณเที่ยว");
                    loaded();
                }
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function calTaxi(distance) {
    var km = distance / 1000;
    var g = 0;
    g += 35;
    km -= 2;
    if (km - 10 < 0) {
        g += km * 5;
    } else {
        g += 10 * 5;
        km -= 10;
        if (km - 8 < 0) {
            g += km * 5.5;
        } else {
            g += 8 * 5.5;
            km -= 8
            if (km - 20 < 0) {
                g += km * 6;
            } else {
                g += 20 * 6;
                km -= 20;
                if (km - 20 < 0) {
                    g += km * 6.5;
                } else {
                    g += 20 * 6.5;
                    km -= 20;
                    if (km - 20 < 0) {
                        g += km * 7.5;
                    } else {
                        g += 20 * 7.5;
                        km -= 20;
                        if (km - 20 > 0) {
                            g += km * 8;
                        }
                    }
                }
            }
        }
    }
    if ((g % 2) % 1 != 0) {
        g = g - ((g % 2)) + 1;
    }
    return g;
}

window.onload = function () {
    getCurrentLocation();
};

function setRecomend() {
    var temp = "";
    var money = parseFloat(document.getElementById("money").value);
    if (isNaN(money)) {
        money = 9999999999999;
    }

    for (var i = 0; i < names.length; i++) {
        var tempName = names[i];
        var str = tempName.split(" ");
        if (str.length <= 2) {
            tempName = names[i];
        } else {
            tempName = str[0] + " " + str[1] + " " + str[2];
        }
        if (money >= taxi[i] + relate_costs[i]) {
            temp += "<div class=\"suggBox\" onclick=\"onSelect(" + i + ");\">";
            temp += "<div id=\"place" + i + "\" class=\"positionSuggName\"  style = \"background-image: url(" + links[i] + ");\"><B>" + i + " : " + tempName + " <br> taxi cost :" + taxi[i] + "<br> time : " + times[i] + "<br> Distance : " + distances[i] + "</B></div>";
            temp += "</div>";
            marker(lats[i], lngs[i], names[i], i, links[i]);
        }
    }
    document.getElementById("recBox").innerHTML = temp;
    loaded();
    setInfo();
}


function loaded() {
    document.getElementById('submit').value = "ค้นหา";
    document.getElementById('submit').disabled = false;
}

function deleteMarkers() {
    clearMarkers();
    markers.length = 0;
}

function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setAllMap(null);
}

function desByUser() {
    var address = document.getElementById('end').value;
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.k;
            var lng = results[0].geometry.location.B;
            var src = "(" + lat + "," + lng + ")";
            var dest = "(" + userlat + "," + userlng + ")";
            calcRoute(lat, lng);
            var requestDistance = "https://maps.googleapis.com/maps/api/directions/json?origin=" + src + "&destination=" + dest + "&avoid=tolls|highways&key=" + apiKeys[0];
            var servlet = 'ParseJSON?link=';
            var url = servlet + requestDistance;
            console.log(url);
            jQuery.getJSON(url, function (data) {
                console.log(data);
                console.log(data.routes[0].legs[0].duration.text + " " + data.routes[0].legs[0].distance.text + " " + calTaxi(data.routes[0].legs[0].distance.value));
                alert(data.routes[0].legs[0].duration.text + " " + data.routes[0].legs[0].distance.text + " " + calTaxi(data.routes[0].legs[0].distance.value));
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

}

function requestDirection(link) {
    var servlet = 'ParseJSON?link=';
    var url = servlet + link;
    var distance;
    var time;
    jQuery.getJSON(url, function (data) {
        console.log(data);
        distance = data.routes[0].legs[0].distance.value;
        time = data.routes[0].legs[0].duration.text;
        taxi.push(calTaxi(distance));
        times.push(time);
        distances.push(data.routes[0].legs[0].distance.text);
        if (times.length == number) {
            setRecomend();
        }
    });
}



function routeFromUser(lat, lng, id, index) {
    var request = 'messenger?cmd=route&lat=' + lat + '&lng=' + lng + '&id=' + id;
    console.log(request);
    routes.push("");
    var temp = [];
    jQuery.getJSON(request, function (route) {
        console.log(route);
        console.log(id);
        if (route.array.length != 0) {
            for (var i = 0; i < route.array.length; i++) {
                temp.push("yes");

            }
            routes[index] = temp;
        } else {
            routes[index] = ["no"];
        }
        console.log(temp);

        console.log(routes);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);