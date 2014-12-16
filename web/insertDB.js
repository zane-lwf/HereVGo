/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    $('#fileUpload').change(function (event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            object = {};
            object.filename = file;
            object.data = event.target.result;
            picPath = object.data;
            ipic = (object.filename.name);
        };
        reader.readAsDataURL(file);
    });
});

function insertPlace() {
    iname = document.getElementById('address').value;
    icost = document.getElementById('cost').value;
    idetail = document.getElementById('detail').value;
    document.getElementById('add').value = "wait";
    console.log("before send param");
    $.post("UploadNewPlace", {"lat": ilat, "lng": ilng, "name": iname, "place_id": iplace_id, "detail": idetail, "cost": icost, "ipic": ipic, "path": picPath}, function (data) {
        alert(data.status);
        console.log(data);
        console.log(ilat);
        console.log(ilng);
        overlay("Place");
    }, "json");
}

function insertRoute() {
    iplace_id = place_ids[select];
    var user = document.getElementById('user').value;
    icost = document.getElementById('costr').value;
    idetail = document.getElementById('detailr').value;
    iname = document.getElementById('source').value;
    console.log(iplace_id);
    $.post("messenger", {"lat": ilat, "lng": ilng, "name": iname, "place_id": iplace_id, "detail": idetail, "cost": icost, "user": user, "cmd": "add"}, function (data) {
        alert(data.status);
        console.log(data);
        console.log(ilat);
        console.log(ilng);
        overlay("Route");
    }, "json");
}



