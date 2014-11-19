<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>HereVGo</title>
        <link rel="stylesheet" type="text/css" href="BgStyle.css">
            <link rel="stylesheet" type="text/css" href="formStyle.css">
                <script src="script.js"></script>
                <style>
                    <!-- sad-->
                    #map-canvas {
                        height: 493px;
                        width: 735px;
                        padding: 0px;
                        position: absolute;
                        left: 17px;
                        top: 21px;
                    }
                    #panel {
                        position: absolute;
                        top: 5px;
                        left: 50%;
                        z-index: 5;
                        background-color: #fff;
                        padding: 5px;
                        border: 1px solid #999;
                    }
                    #directions-panel {
                        height: 100%;
                        float: right;
                        width: 390px;
                        overflow: auto;
                    }
                    #control {
                        padding: 5px;
                        font-size: 14px;
                        font-family: Arial;
                        z-index: 100;
                        position: absolute;
                        left: 52px;
                        top: 31px;
                        width: 245px;
                        height: 198px;
                    }
                    #directions-panel {
                        float: none;
                        width: auto;
                    }
                </style>
                <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDiEtqOtMKrFTOkPKdexB0djGKXfxy6xbM&libraries=places"></script>

                <script src="http://code.jquery.com/jquery-2.1.0.min.js"></script>
                <script>
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
                        var text = descriptions[select] + "<br> ค่าเข้า : " + relate_costs[select];
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
                        console.log(document.getElementById("money").value);
                        console.log(names);
                        document.getElementById("recBox").innerHTML = "load";
                        deleteMarkers();
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
                        console.log(names);
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
                                console.log(pos);
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
                                console.log(lat + " " + lng);
                                var request = 'messenger?cmd=radius&lat=' + lat + '&lng=' + lng + '&r=' + radius;
                                console.log(request);
                                jQuery.getJSON(request, function (place) {
                                    number = place.array.length;
                                    if (place.array.length != 0) {
                                        for (count = 0; count < place.array.length; count++) {
                                            var dest = "(" + place.array[count].lat + "," + place.array[count].lng + ")";
                                            var src = "(" + lat + "," + lng + ")";
                                            var requestDistance = "https://maps.googleapis.com/maps/api/directions/json?origin=" + src + "&destination=" + dest + "&avoid=tolls|highways&key=" + apiKeys[count % apiKeys.length];
                                            requestDirection(requestDistance);
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
                        console.log(distance);
                        return 35 + ((distance / 1000) * 5);
                    }

                    window.onload = function () {
                        getCurrentLocation();
                    };

                    function setRecomend() {
                        var temp = "";
                        console.log(markers.length);
                        var money = parseFloat(document.getElementById("money").value);
                        console.log(money);
                        if (isNaN(money)) {
                            money = 9999999999999;
                        }
                        console.log(money);
                        for (var i = 0; i < names.length; i++) {
                            if (money >= taxi[i] + relate_costs[i]) {
                                temp += "<div class=\"suggBox\" onclick=\"onSelect(" + i + ");\">";
                                temp += "<div id=\"place" + i + "\" class=\"positionSuggName\"  style = \"background-image: url("+links[i]+");\"><B>" + i + " : " + names[i] + " <br> taxi cost :" + taxi[i] + "<br> time : " + times[i] + "</B></div>";
                                //document.getElementById("place" + i).style.backgroundImage = "url(" + links[i] + ")";
                                temp += "</div>";
                                marker(lats[i], lngs[i], names[i], i, links[i]);
                            }
                        }
                        document.getElementById("recBox").innerHTML = temp;
                        loaded();
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
                            console.log(calTaxi(distance));
                            taxi.push(calTaxi(distance));
                            times.push(time);
                            distances.push(data.routes[0].legs[0].distance.text);
                            if (times.length == number) {
                                setRecomend();
                            }
                            console.log(time);
                        });
                    }

                    google.maps.event.addDomListener(window, 'load', initialize);
                </script>
                </head>
                <body  >
                    <div id="all">
                        <div id="LogoProj" ></div>
                        <div id="pic02" >
                            <div id="control">
                                <input class="textbox"  style="width: 200px" type="submit" value="ตำแหน่งของฉัน" onclick="getCurrentLocation();" />
                                <BR />
                                <input class="textbox"  id="start" style="width: 190px"  type="text"  placeholder="ต้นทาง" onfocusout="locationByUser();" /><BR />
                                <input class="textbox"  id="end"  style="width: 190px" type="text" placeholder="ปลายทาง" onfocusout="desByUser()"/><BR />
                                <input class="textbox"  id="money"  style="width: 190px" type="text" placeholder="เงิน" /><BR />
                                <select id="radius" class="textbox" style="width: 200px">
                                    <option value=10>10 km</option>
                                    <option value=25>25 km</option>
                                    <option value=50>50 km</option>
                                    <option value=100>100 km</option>
                                    <option value=10000000>unlimit</option>
                                </select><BR />
                                <input class="textbox"  id="submit" style="width: 200px" type="submit" value="ค้นหา" onclick="reset()"/>
                            </div>
                        </div>
                        <div id="head1" >
                          <div id="map-canvas"></div>
                        </div>
                        <div id="lt1" >
                            <div id="suggHead"></div>
                            <div id="suggBkList" class="scrollbar">
                                <div id="suggDetail">

                                    <div id="recBox"></div>

                                </div>
                            </div>
                        </div>
                        <div id="spic1" >
                          <div id="picLocate"></div>
                            <div id="picDisc"> </div>
                            <div id="textInPicDis">loading . . .</div>
                            <div id="textReg">สถานที่เเนะนำ</div>
                        </div>
                        <div id="spic"></div>
                        <div id="fromUserBG">
                          <div id="fromUserHead">ค่าเดินทางจากผู้ใช้ท่านอื่นๆ</div>
                          <div id="fromUserDetail"></div> <!--ย้ายค่าเดินทางตรงผลการค้นหา กะ ค่าเข้าตรง disc มาใส่ในนี้นะครัชชชช-->
                        </div>
                        <div id="BottWeb"></div>
                    </div>
                </body>
                </html>
