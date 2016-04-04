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
var avalible = 0;

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
    var start = /** @type {HTMLInputElement} */(
            document.getElementById('start'));
    var address = /** @type {HTMLInputElement} */(
            document.getElementById('address'));
    var source = /** @type {HTMLInputElement} */(
            document.getElementById('source'));


    var autocomplete = new google.maps.places.Autocomplete(start);
    var autocompletePlace = new google.maps.places.Autocomplete(address);
    var autocompleteOrigin = new google.maps.places.Autocomplete(source);

    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        //infowindow.close();
        //marker.setVisible(false);
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
        //infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        //infowindow.open(map, marker);
    });

}
//end of initailize


//start set direction
function calcRoute(lat, lng) {
    //var start = document.getElementById('start').value;
    var end =  lat + ',' + lng;
    var start = userlat + ',' + userlng;;
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
            directionsDisplay.setMap(map);
            directionsDisplay.setOptions({suppressMarkers: true});
        } else {
            alert("Service fail");
            console.log(status);
            console.log(response);
        }
    });
    loaded;
}
//end set directtion


//get current location
var userlat;
var userlng;
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
            userlat = pos.lat();
            userlng = pos.lng();
            //codeLatLng();
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
        var content = 'กรุณาใส่สถานที่ต้นทางให้ถูกต้อง';
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
    document.getElementById("btn").disabled = false;
    calcRoute(lats[select], lngs[select]);
    setInfo();
    showRouteFromUser();
}


var infowindow = null;
//set marker
function marker(lat, lng, title, number, pic) {
    var myLatlng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: title,
        icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (number + 1) + "|FF0000|000000"
    });

    google.maps.event.addListener(marker, 'click', function () {
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
    document.getElementById("picLocate").style.backgroundImage = "url(" + links[select] + ")";
    document.getElementById("placeName").innerHTML = "<b>" + names[select] + "<b>"
}
//end desciption & picture

function loading() {
    document.getElementById("textInPicDis").innerHTML = "loading . . .";
    document.getElementById("picLocate").style.backgroundImage = "url(img/spinner.gif)";
    document.getElementById('submit').value = "กำลังค้นหา";
    document.getElementById('submit').disabled = true;
}

function reset() {
    document.getElementById("recBox").innerHTML = "";
    document.getElementById("placeName").innerHTML = "";
    deleteMarkers();
    directionsDisplay.setMap(null);
    document.getElementById("routebox").innerHTML = "";
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
    avalible = 0;
    loading();
    findPlaces();
}

function locationByUser() {
    var address = document.getElementById('start').value;
    // console.log(address);
    geocoder.geocode({'address': address}, function (results, status) {
        //console.log(results);
        //console.log(status);
        if (status == google.maps.GeocoderStatus.OK) {
            if (infowindow != null) {
                infowindow.close();
            }
            userlat = results[0].geometry.location.lat();
            userlng = results[0].geometry.location.lng();
            var pos = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
            // console.log(results[0].geometry.location);
            console.log("(" + results[0].geometry.location.lat() + "," + results[0].geometry.location.lng() + ")");
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
        if ( ( userlat && userlng ) || status == google.maps.GeocoderStatus.OK) {
            //var lat = results[0].geometry.location.lat();
            //var lng = results[0].geometry.location.lng();
            var lat = userlat;
            var lng = userlng;
            var request = 'messenger?cmd=radius&lat=' + lat + '&lng=' + lng + '&r=' + radius;
            console.log(request);
            jQuery.getJSON(request, function (place) {
                //jQuery.getJSON("check.json", function (place) {
                console.log(place);
                number = place.array.length;
                if (place.array.length != 0) {
                    for (count = 0; count < place.array.length; count++) {
                        place_ids.push("");
                        names.push("");
                        lats.push("");
                        lngs.push("");
                        names.push("");
                        descriptions.push("");
                        relate_costs.push("");
                        links.push("");
                        routes.push("");
                        taxi.push("");
                        times.push("");
                        distances.push("");
                        var dest = place.array[count].lat + "," + place.array[count].lng;
                        var src =  lat + "," + lng;
                        var requestDistance = "https://maps.googleapis.com/maps/api/directions/json?origin=" + src + "&destination=" + dest + "&avoid=tolls|highways&key=" + apiKeys[count % apiKeys.length];
                        requestDirection(requestDistance, count);
                        place_ids[count] = (place.array[count].place_id);
                        lats[count] = (place.array[count].lat);
                        lngs[count] = (place.array[count].lng);
                        names[count] = (place.array[count].name);
                        descriptions[count] = (place.array[count].description);
                        relate_costs[count] = (place.array[count].related_cost);
                        links[count] = (place.array[count].link);
                        routeFromUser(lat, lng, place.array[count].place_id, count);
                    }
                } else {
                    alert("ไม่พบสถานที่เที่ยวในบริเวณนี้");
                    loaded();
                }
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
            console.log(status);
            loaded();
        }
    });
}

function calTaxi(distance) {
    var km = distance / 1000;
    var g = 0;
    g += 35;
    km -= 1;
    if (km < 0)
        km = 0;
    if (km - 10 < 0) {
        g += km * 5;
    } else {
        g += 10 * 5;
        km -= 10;
        if (km - 8 < 0) {
            g += km * 5.5;
        } else {
            g += 8 * 5.5;
            km -= 8;
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
    var count = 1;
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
        try {
            if (routes[i] !== "") {
                if (money >= taxi[i] + relate_costs[i] || money >= (routes[i][0][2] + relate_costs[i])) {
                    temp += "<div class=\"suggBox\" onclick=\"onSelect(" + i + ");\">";
                    temp += "<div id=\"place" + i + "\" class=\"positionSuggName\"  style = \"background-image: url(" + links[i] + ");\"><B>" + count++ + " : " + tempName + " <br> taxi cost : " + taxi[i] + "<br> time : " + times[i] + "<br> Distance : " + distances[i] + "</B></div>";
                    temp += "</div>";
                    marker(lats[i], lngs[i], names[i], i, links[i]);
                    avalible++;
                }
            } else {
                if (money >= taxi[i] + relate_costs[i]) {
                    temp += "<div class=\"suggBox\" onclick=\"onSelect(" + i + ");\" href=\"#modal-container-info\" role=\"button\" class=\"btn\" data-toggle=\"modal\">";
                    temp += "<div id=\"place" + i + "\" class=\"positionSuggName list-group-item\"  style = \"background-image: url(" + links[i] + ");\"><B>" + count++ + " : " + tempName + " <br> taxi cost : " + taxi[i] + "<br> time : " + times[i] + "<br> Distance : " + distances[i] + "</B></div>";
                    temp += "</div>";
                    marker(lats[i], lngs[i], names[i], i, links[i]);
                    avalible++;
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    document.getElementById("recBox").innerHTML = temp;
    if (avalible === 0) {
        alert("ไม่พบสถานที่ ที่เงินของคุณจะใช้จ่ายได้ กรุณาเพิ่มยอดเงินหรือเพิ่มข้อมูลสถานที่ใหม่");
    }
    loaded();
}


function loaded() {
    document.getElementById('submit').value = "ค้นหา";
    document.getElementById('submit').disabled = false;
    document.getElementById("textInPicDis").innerHTML = "";//load data complete
    document.getElementById("picLocate").style.backgroundImage = "url(img/guide.png)";
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
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            var src = "(" + lat + "," + lng + ")";
            var dest = "(" + userlat + "," + userlng + ")";
            calcRoute(lat, lng);
            var requestDistance = "https://maps.googleapis.com/maps/api/directions/json?origin=" + src + "&destination=" + dest + "&avoid=tolls|highways&key=" + apiKeys[0];
            var servlet = 'ParseJSON?link=';
            var url = servlet + requestDistance;
            jQuery.getJSON(url, null, function (data) {
                console.log(data);
                console.log(data.routes[0].legs[0].duration.text + " " + data.routes[0].legs[0].distance.text + " " + calTaxi(data.routes[0].legs[0].distance.value));
                alert(data.routes[0].legs[0].duration.text + " " + data.routes[0].legs[0].distance.text + " " + calTaxi(data.routes[0].legs[0].distance.value));
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function requestDirection(link, index) {
    var servlet = 'ParseJSON?link=';
    var url = servlet + link;
    // console.log(link);
    var distance;
    var time;
    try {
        jQuery.getJSON(url, null, function (data) {
            console.log(data);
            distance = data.routes[0].legs[0].distance.value;
            time = data.routes[0].legs[0].duration.text;
            taxi[index] = (calTaxi(distance));
            times[index] = (time);
            distances[index] = (data.routes[0].legs[0].distance.text);
        });
    } catch (err) {
        console.log(err.message);
    }
}

function routeFromUser(lat, lng, id, index) {
    var request = 'messenger?cmd=route&lat=' + lat + '&lng=' + lng + '&id=' + id;
    jQuery.getJSON(request, null, function (data) {
        var n = index;
        var temp = [];
        if (data.array.length != 0) {
            for (var i = 0; i < data.array.length; i++) {
                if (data.array[i].place_id == id) {
                    temp.push([data.array[i].description, data.array[i].user, data.array[i].total_cost]);
                }
            }
            routes[n] = temp;
        }
        if (index == (times.length) - 1) {
            setRecomend();
        }
    });
}


function showRouteFromUser() {
    var temp = "";
    var money = parseFloat(document.getElementById("money").value);
    if (isNaN(money)) {
        money = 9999999999999;
    }
    if (routes[select] != "" && routes[select] != []) {
        for (var i = 0; i < routes[select].length; i++) {
            if (routes[select][i][2] <= money)
                temp += "<div id = \"resultFromUser\">" + routes[select][i][0] + "<br>total cost :" + routes[select][i][2] + "<br>By :" + routes[select][i][1] + "</div><br>";
        }
    } else {
        temp += "<div>No Data</div>";
    }
    document.getElementById("routebox").innerHTML = temp;
}

//parameter for insert database
var ilat;
var ilng;
var iname;
var idetail;
var ipic;
var picPath;
var icost;
var iplace_id;

function codeAddress(input) {
    var address = document.getElementById(input).value;
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            ilat = results[0].geometry.location.lat();
            ilng = results[0].geometry.location.lng();
            placeID();
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


function placeID() {
    var servlet = 'ParseJSON?link=';
    var link = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + ilat + "," + ilng + "&radius=10&key=AIzaSyDiEtqOtMKrFTOkPKdexB0djGKXfxy6xbM";
    var url = servlet + link;
    console.log(link);
    jQuery.getJSON(url, function (data) {
        if (data.status == "OK") {
            iplace_id = data.results[0].place_id;
            ilat = data.results[0].geometry.location.lat;
            ilng = data.results[0].geometry.location.lng;
        }
    });
}


function codeLatLng() {
    var latlng = new google.maps.LatLng(userlat, userlng);
    geocoder.geocode({'latLng': latlng}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                map.setZoom(11);
                document.getElementById('start').value = (results[1].formatted_address);
            } else {
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}


google.maps.event.addDomListener(window, 'load', initialize);
