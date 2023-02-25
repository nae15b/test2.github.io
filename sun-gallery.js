window.addEventListener("load", function () {
	baguetteBox.run(".gallery");
});

function getResultsForCategory(catID) {
	//get the current URL without any query parameters
	const baseUrl = location.protocol + "//" + location.host + location.pathname;
	
	window.location.href = (catID === 0 ? baseUrl : baseUrl + "?cid=" + catID);
}