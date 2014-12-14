/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    $('#fileUpload').change(function (event) {
        picPath = URL.createObjectURL(event.target.files[0]);
        alert(picPath);
        console.log(picPath);
    });
});

function insertPlace() {
    iname = document.getElementById('address').value;
    ilat = document.getElementById('lat').value;
    ilng = document.getElementById('lng').value;
    icost =  document.getElementById('cost').value;
    idetail = "document.getElementById('detail').value";
    console.log("before send param")
    $.post("UploadNewPlace", {"lat": ilat, "lng": ilng,"name":iname,"place_id":iplace_id,"detail":idetail,"cost":icost,"path":picPath,"ipic":"test.jpg"}, function (data) {
      console.log("after send param");
      console.log(data) ;     
    }, "json");
}



