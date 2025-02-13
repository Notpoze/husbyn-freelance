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
		}
	});
});

document.querySelectorAll(".card, .contact").forEach((el) => {
	el.classList.add("fade-in");
	observer.observe(el);
});

document.addEventListener("DOMContentLoaded", () => {
	const navLinks = document.querySelectorAll("nav a");
	const currentPage = window.location.pathname;

	navLinks.forEach((link) => {
		const linkPath = link.getAttribute("href");

		// If the current page's path matches the link's path, mark it as active
		// If the homepage is requested (root '/', index.html), treat it as active for '/'
		if (currentPage === linkPath || (currentPage === "/" && linkPath === "/")) {
			link.classList.add("active");
		} else {
			link.classList.remove("active");
		}
	});
});
