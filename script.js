// // Add language checker
// document.addEventListener("DOMContentLoaded", () => {
// 	const userLang = navigator.language || navigator.userLanguage; // Get browser language

// 	if (
// 		userLang.startsWith("no") ||
// 		userLang.startsWith("nb") ||
// 		userLang.startsWith("nn")
// 	) {
// 		if (!window.location.pathname.startsWith("/no/")) {
// 			window.location.href = "/no/";
// 		}
// 	}
// });

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();
		document.querySelector(this.getAttribute("href")).scrollIntoView({
			behavior: "smooth",
		});
	});
});

// Add fade-in animation on scroll
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add("visible");
			observer.unobserve(entry.target);
		}
	});
});

document.querySelectorAll(".card, .contact").forEach((el) => {
	el.classList.add("fade-in");
	observer.observe(el);
});

document.addEventListener("DOMContentLoaded", () => {
	const navLinks = document.querySelectorAll("nav a");
	// Get current file name from the URL, default to 'index.html'
	const currentFile = (
		window.location.pathname.split("/").pop() || "index.html"
	).toLowerCase();

	navLinks.forEach((link) => {
		// Extract file name from the link's href
		const linkHref = link.getAttribute("href");
		const linkFile = (linkHref.split("/").pop() || "index.html").toLowerCase();

		if (currentFile === linkFile) {
			link.classList.add("active");
		} else {
			link.classList.remove("active");
		}
	});
});
