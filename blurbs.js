window.addEventListener("DOMContentLoaded", function () {
	const slider = tns({
		container: ".msblurbs__wrap--testimonials",
		//center: true,
		items: 1,
		nav: true,
		navPosition: "bottom",
		controls: false,
	});
	document
		.querySelectorAll(".tns-nav button")
		.forEach((btn) => (btn.type = "button"));
});
