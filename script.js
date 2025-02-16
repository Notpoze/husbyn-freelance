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

	// Helper function: if a URL ends with a slash or is empty, treat it as the index.
	function normalizeUrl(url) {
		// Remove any query string/hash if needed here (optional)
		if (url.endsWith("/")) {
			return url + "index.html";
		}
		return url || "index.html";
	}

	// Normalize the current page’s path.
	const normalizedCurrent = normalizeUrl(window.location.pathname);

	navLinks.forEach((link) => {
		const href = link.getAttribute("href");
		const normalizedLink = normalizeUrl(href);
		if (normalizedCurrent === normalizedLink) {
			link.classList.add("active");
		} else {
			link.classList.remove("active");
		}
	});
});
