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
            picPath=object.data;
            console.log(object.data);
            console.log(object.filename);
            console.log(object);
        };
        reader.readAsDataURL(file);
    });
});

function insertPlace() {
    iname = document.getElementById('address').value;
    ilat = document.getElementById('lat').value;
    ilng = document.getElementById('lng').value;
    icost = document.getElementById('cost').value;
    idetail = document.getElementById('detail').value;
    ipic="Tulips.jpg";
    console.log("before send param");
    $.post("UploadNewPlace", {"lat": ilat, "lng": ilng, "name": iname, "place_id": iplace_id, "detail" : idetail, "cost": icost, "ipic" : ipic , "path": picPath}, function (data) {
        console.log("after send param");
        console.log(data);
        document.getElementById("reply").innerHTML = data.status;
    }, "json");
}

function insertRoute(){
    ilat = document.getElementById('lat').value;
    ilng = document.getElementById('lng').value;
    icost = document.getElementById('cost').value;
    idetail = document.getElementById('detail').value;
    iname = document.getElementById('user').value;
}



