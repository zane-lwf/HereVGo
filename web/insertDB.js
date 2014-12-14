/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    $('#fileUpload').change(function (event) {
        var path = URL.createObjectURL(event.target.files[0]);
        alert(path);
        console.log(path);
    });
});



