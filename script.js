// Base path configuration - helps work in both local and production environments
document.addEventListener("DOMContentLoaded", function () {
	// Detect if we're running locally or on the production domain
	const isLocalhost =
		window.location.hostname === "localhost" ||
		window.location.hostname === "127.0.0.1" ||
		window.location.protocol === "file:";

	// Set the base path accordingly
	const basePath = isLocalhost ? "" : "/";

	// Fix all asset paths that start with '/'
	document
		.querySelectorAll(
			'img[src^="/"], link[href^="/"], script[src^="/"], video source[src^="/"]'
		)
		.forEach((el) => {
			const attrName = el.hasAttribute("src") ? "src" : "href";
			const currentPath = el.getAttribute(attrName);

			// Skip URLs that are already absolute with domain
			if (currentPath.startsWith("http")) return;

			// Replace the leading slash with the appropriate base path
			const newPath = currentPath.replace(/^\//, basePath);
			el.setAttribute(attrName, newPath);
		});
});

// Add at the beginning of your script.js file
document.addEventListener("DOMContentLoaded", function () {
	// Generate a timestamp-based version parameter
	const cssVersion = new Date().getTime();

	// Find all CSS link tags
	document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
		// Get the current href
		const href = link.getAttribute("href");

		// Only modify if it doesn't already have a timestamp parameter
		if (href && !href.includes("v=timestamp")) {
			// Remove any existing version parameter
			const cleanHref = href.split("?")[0];

			// Add the new timestamp parameter
			link.setAttribute("href", `${cleanHref}?v=timestamp${cssVersion}`);
		}
	});
});

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
	initSmoothScroll();
	initAnimations();
	initActiveNavLinks();
	initLanguageSwitcher();
	initLazyLoadImages();
	initVideoOptimization();
});

// Smooth scroll for anchor links
function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			// Skip if it's the language switcher or has a specific class
			if (
				this.classList.contains("language-link") ||
				this.getAttribute("href") === "#"
			) {
				return;
			}

			e.preventDefault();

			const targetId = this.getAttribute("href");
			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});

				// Update URL without reload
				history.pushState(null, null, targetId);
			}
		});
	});
}

// Animation on scroll
function initAnimations() {
	// Use Intersection Observer for scroll animations
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{
			root: null,
			rootMargin: "0px",
			threshold: 0.1,
		}
	);

	// Add fade-in class to elements
	const animateElements = document.querySelectorAll(
		".card, .gallery-item, .video-section, .about-section, .contact, .cta-section"
	);
	animateElements.forEach((el) => {
		el.classList.add("fade-in");
		observer.observe(el);
	});
}

// Mark current page in navigation
function initActiveNavLinks() {
	const navLinks = document.querySelectorAll("nav a");

	// Get current path from URL
	const currentPath = window.location.pathname;

	// Extract the page name from the path
	let currentPage = currentPath.split("/").pop() || "index.html";

	// Fix for homepage where pathname might end with / or be empty
	if (currentPage === "" || currentPage === "/") {
		currentPage = "index.html";
	}

	navLinks.forEach((link) => {
		// Get the href attribute
		const linkHref = link.getAttribute("href");

		// Extract the page name from the href
		let linkPage = linkHref;

		// Remove leading '/' or './' if present
		if (linkPage.startsWith("/") || linkPage.startsWith("./")) {
			linkPage = linkPage.replace(/^(\/|\.\/)/, "");
		}

		// Handle empty href or just "/"
		if (linkPage === "" || linkPage === "/") {
			linkPage = "."; // Representing home page
		}

		// Check if this link points to the current page
		const isCurrentPage =
			(currentPage === "index.html" &&
				(linkPage === "." || linkPage === "./" || linkPage === "index.html")) ||
			(currentPage !== "index.html" && linkPage.includes(currentPage));

		if (isCurrentPage) {
			link.setAttribute("aria-current", "page");
		} else {
			link.removeAttribute("aria-current");
		}
	});
}

// Language switcher functionality
function initLanguageSwitcher() {
	const switcherContainers = document.querySelectorAll("#language-switcher");
	if (!switcherContainers.length) return;

	// Determine current language from URL path
	let currentPath = window.location.pathname;
	let currentLang = currentPath.includes("/no/") ? "no" : "en";
	let alternativePath = "";

	// Current page filename
	const currentFile = currentPath.split("/").pop() || "index.html";

	// Build alternative language URL
	if (currentLang === "no") {
		// Convert Norwegian URL to English
		alternativePath = "/" + currentFile;
	} else {
		// Convert English URL to Norwegian
		alternativePath = "/no/" + currentFile;
	}

	// Special case for home page
	if (currentFile === "" || currentFile === "index.html") {
		alternativePath = currentLang === "no" ? "/" : "/no/";
	}

	// Cleanup double slashes in the path if any
	alternativePath = alternativePath.replace(/\/+/g, "/");

	// Create language switcher HTML
	const enActive = currentLang === "en" ? "active-lang" : "";
	const noActive = currentLang === "no" ? "active-lang" : "";

	const languageHTML = `
	  <a href="${currentLang === "en" ? "#" : alternativePath}" 
		 class="language-link ${enActive}" 
		 data-lang="en" 
		 aria-label="Switch to English"
		 ${currentLang === "en" ? 'aria-current="true"' : ""}>
		 🇬🇧
	  </a>
	  <span class="language-divider">|</span>
	  <a href="${currentLang === "no" ? "#" : alternativePath}" 
		 class="language-link ${noActive}" 
		 data-lang="no" 
		 aria-label="Bytt til norsk"
		 ${currentLang === "no" ? 'aria-current="true"' : ""}>
		 🇳🇴
	  </a>
	`;

	// Add to all language switcher containers
	switcherContainers.forEach((container) => {
		container.innerHTML = languageHTML;
	});
}

// Optimize video loading
function initVideoOptimization() {
	// Only load videos when they're near the viewport
	const videos = document.querySelectorAll("video");

	if ("IntersectionObserver" in window) {
		const videoObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const video = entry.target;
						const sources = video.querySelectorAll("source");

						sources.forEach((source) => {
							// Set the real source only when video is visible
							const dataSrc = source.getAttribute("data-src");
							if (dataSrc) {
								source.src = dataSrc;
							}
						});

						// Load the video
						video.load();
						videoObserver.unobserve(video);
					}
				});
			},
			{
				rootMargin: "100px 0px",
			}
		);

		videos.forEach((video) => {
			videoObserver.observe(video);
		});
	}
}
