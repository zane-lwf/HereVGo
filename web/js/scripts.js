// Empty JS for your own code to be here
function editMapHeigh () {
    $('#map-canvas').css("min-height",$(window).height()+"px");
}

$(document).ready( function() {
	editMapHeigh ();
});

window.onresize = function(event) {
    editMapHeigh ();
};

