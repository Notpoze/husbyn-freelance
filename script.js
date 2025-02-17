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

document.addEventListener("DOMContentLoaded", function () {
	// Select all elements that should contain the language switcher
	const switcherContainers = document.querySelectorAll("#language-switcher");
	if (!switcherContainers.length) return;

	let currentPath = window.location.pathname;
	if (!currentPath.startsWith("/")) {
		currentPath = "/" + currentPath;
	}

	let currentLang = "en";
	let altPath = "";

	if (
		currentPath.startsWith("/no/") ||
		currentPath === "/no/" ||
		currentPath.includes("/no/index.html")
	) {
		currentLang = "no";
		// Remove '/no' from the URL to build the English alternative
		altPath = currentPath.replace("/no", "") || "/";
	} else {
		currentLang = "en";
		// If at root, then the Norwegian version is at '/no/'
		if (currentPath === "/" || currentPath === "/index.html") {
			altPath = "/no/";
		} else {
			altPath = "/no" + currentPath;
		}
	}

	const enActive = currentLang === "en" ? "active-lang" : "";
	const noActive = currentLang === "no" ? "active-lang" : "";

	const languageHTML = `
	<a href="${
		currentLang === "en" ? "#" : altPath
	}" class="language-link ${enActive}" data-lang="en" aria-label="Switch to English">🇬🇧</a>
	<span>|</span>
	<a href="${
		currentLang === "no" ? "#" : altPath
	}" class="language-link ${noActive}" data-lang="no" aria-label="Bytt til norsk">🇳🇴</a>
  `;

	// Populate every container that should show the language switcher
	switcherContainers.forEach(function (container) {
		container.innerHTML = languageHTML;
	});
});
