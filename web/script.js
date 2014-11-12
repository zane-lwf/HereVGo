   var directionsDisplay;
                    var directionsService = new google.maps.DirectionsService();
                    var map;
                    var onSelect;

//start initalize
                    function initialize() {
                        //about map
                        directionsDisplay = new google.maps.DirectionsRenderer();
                        var mapOptions = {
                            zoom: 8,
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
                    function calcRoute() {
                        var selectedMode = document.getElementById('mode').value;
                        var start = document.getElementById('start').value;
                        var end = document.getElementById('end').value;
                        var request = {
                            origin: start,
                            destination: end,
                            travelMode: google.maps.TravelMode[selectedMode]
                        };
                        directionsService.route(request, function (response, status) {
                            if (status == google.maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);
                            }
                        });
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
                                    content: 'Your Location'
                                });
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

//set recomend place
                    function recPlaces() {
                        var text = 'place';
                        jQuery.getJSON('json.json', function (place) {
                            console.log(place);
                            for (var i = 0; i < place.array.length; i++) {
                                console.log(text + i);
                                document.getElementById(text + (i)).innerHTML = place.array[i].name;
                            }
                        });
                    }
//end recomend place


//set marker
                    function marker(lat, lng, title) {
                        myLatlng = new google.maps.LatLng(lat, lng);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            title: title
                        });
                    }
//end marker


//set desciption & picture
                    function setInfo(select) {
                        jQuery.getJSON('json.json', function (place) {
                            //console.log(place);
                            console.log(select);
                            document.getElementById("textInPicDis").innerHTML = place.array[select].description;
                            marker(place.array[select].lat, place.array[select].lng, place.array[select].name);
                            console.log(place.array[select].lat + ":" + place.array[select].lng);
                            changeShowImg(place.array[select].lat, place.array[select].lng);
                            document.getElementById('nameForRoute').value = place.array[select].name;
                        });
                    }
//end desciption & picture


//set picture change
                    function changeShowImg(lat, lng) {
                        //alert(lat+":"+lng);
                        var servlet = 'ParseJSON?link=';
                        var link = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&radius=50&key=AIzaSyDiEtqOtMKrFTOkPKdexB0djGKXfxy6xbM";
                        var url = servlet + link;
                        console.log(url);
                        jQuery.getJSON(url, function (data) {
                            console.log(data);
                            var link = "https://maps.googleapis.com/maps/api/place/details/json?reference=" + data.results[0].reference + "&key=AIzaSyDiEtqOtMKrFTOkPKdexB0djGKXfxy6xbM";
                            //console.log(link);
                            //jQuery.getJSON('ParseJSON?link=' + link, function (photo) {
                            var photoRef = data.results[1].photos[0].photo_reference;
                            console.log(photoRef);
                            var srcImg = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=";
                            console.log(srcImg + photoRef);
                            var keyValue = "&key=AIzaSyDiEtqOtMKrFTOkPKdexB0djGKXfxy6xbM";
                            console.log(srcImg + photoRef + keyValue);
                            document.getElementById("picLocate").src = srcImg + photoRef + keyValue;
                            //});
                        });
                    }
//end set picture



//set end
                    function setEnd() {
                        document.getElementById('end').value = document.getElementById('nameForRoute').value;
                    }

                    window.onload = function () {
                        //set recommend place
                        recPlaces();
                    };

                    google.maps.event.addDomListener(window, 'load', initialize);
