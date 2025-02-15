// Add language checker
document.addEventListener("DOMContentLoaded", () => {
	const userLang = navigator.language || navigator.userLanguage; // Get browser language

	if (
		userLang.startsWith("no") ||
		userLang.startsWith("nb") ||
		userLang.startsWith("nn")
	) {
		if (!window.location.pathname.startsWith("/no/")) {
			window.location.href = "/no/";
		}
	}
});

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
	// Get only the file name from the current pathname.
	const currentPage = window.location.pathname.split("/").pop() || "index.html";

	navLinks.forEach((link) => {
		const linkPath = link.getAttribute("href");

		if (currentPage === linkPath) {
			link.classList.add("active");
		} else {
			link.classList.remove("active");
		}
	});
});
