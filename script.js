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
	const currentFile = (
		currentPath.split("/").pop() || "index.html"
	).toLowerCase();

	navLinks.forEach((link) => {
		const linkHref = link.getAttribute("href");
		let linkFile = "";

		// Handle both relative and absolute paths
		if (linkHref.startsWith("/")) {
			linkFile = (linkHref.split("/").pop() || "index.html").toLowerCase();
		} else {
			linkFile = linkHref.toLowerCase();
		}

		// Special case for home page
		if (linkFile === "/" || linkFile === "") {
			linkFile = "index.html";
		}

		if (
			currentFile === linkFile ||
			(currentFile === "index.html" && (linkFile === "/" || linkFile === ""))
		) {
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

	// Build alternative language URL
	if (currentLang === "no") {
		// Convert Norwegian URL to English
		alternativePath = currentPath.replace("/no", "") || "/";
		if (alternativePath === "") alternativePath = "/";
	} else {
		// Convert English URL to Norwegian
		if (currentPath === "/" || currentPath === "/index.html") {
			alternativePath = "/no/";
		} else {
			// Insert /no/ before the path, handling both with and without leading slash
			alternativePath =
				"/no" + (currentPath.startsWith("/") ? "" : "/") + currentPath;
		}
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

// Lazy load images for performance
function initLazyLoadImages() {
	if ("loading" in HTMLImageElement.prototype) {
		// Browser supports native lazy loading
		document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
			img.src = img.getAttribute("data-src");
		});
	} else {
		// Fallback for browsers that don't support native lazy loading
		const lazyImages = document.querySelectorAll('img[loading="lazy"]');

		if ("IntersectionObserver" in window) {
			const imageObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const lazyImage = entry.target;
						lazyImage.src = lazyImage.getAttribute("data-src");
						imageObserver.unobserve(lazyImage);
					}
				});
			});

			lazyImages.forEach((image) => {
				imageObserver.observe(image);
			});
		} else {
			// Fallback for older browsers without IntersectionObserver
			let active = false;

			const lazyLoad = function () {
				if (active === false) {
					active = true;

					setTimeout(function () {
						lazyImages.forEach((lazyImage) => {
							if (
								lazyImage.getBoundingClientRect().top <= window.innerHeight &&
								lazyImage.getBoundingClientRect().bottom >= 0 &&
								getComputedStyle(lazyImage).display !== "none"
							) {
								lazyImage.src = lazyImage.getAttribute("data-src");

								lazyImages = lazyImages.filter(function (image) {
									return image !== lazyImage;
								});

								if (lazyImages.length === 0) {
									document.removeEventListener("scroll", lazyLoad);
									window.removeEventListener("resize", lazyLoad);
									window.removeEventListener("orientationchange", lazyLoad);
								}
							}
						});

						active = false;
					}, 200);
				}
			};

			document.addEventListener("scroll", lazyLoad);
			window.addEventListener("resize", lazyLoad);
			window.addEventListener("orientationchange", lazyLoad);
		}
	}
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
