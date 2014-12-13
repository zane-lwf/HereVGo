/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function overlay(n) {
    el = document.getElementById("overlay" + n);
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}


function scrollWin() {
    window.scrollTo(0, 0);
}
