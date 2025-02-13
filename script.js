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

		// Check if current page matches the link (handling home and portfolio)
		if (
			currentPage === linkPath ||
			(currentPage === "/" && linkPath === "index.html") ||
			(currentPage === "/index.html" && linkPath === "index.html") ||
			(currentPage === "/portfolio.html" && linkPath === "portfolio.html")
		) {
			link.classList.add("active");
		} else {
			link.classList.remove("active");
		}
	});
});
