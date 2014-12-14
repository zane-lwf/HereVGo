function overlay(n) {
    el = document.getElementById("overlay" + n);
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}


function scrollWin() {
    window.scrollTo(0, 0);
}
