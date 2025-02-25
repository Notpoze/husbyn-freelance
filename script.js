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

// Language switcher functionality with flags for all devices
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

	// Create language switcher HTML with flags for all devices
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

// Initialize lightbox
function initLightbox() {
	// Create lightbox container if it doesn't exist
	if (!document.getElementById("lightbox-container")) {
		const lightboxHTML = `
		<div id="lightbox-container" class="lightbox-container">
		  <div class="lightbox-content">
			<img id="lightbox-image" src="" alt="Enlarged image">
			<div class="lightbox-caption" id="lightbox-caption"></div>
		  </div>
		  <button class="lightbox-prev" id="lightbox-prev" aria-label="Previous image">❮</button>
		  <button class="lightbox-next" id="lightbox-next" aria-label="Next image">❯</button>
		  <button class="lightbox-close" id="lightbox-close" aria-label="Close lightbox">×</button>
		</div>
	  `;
		document.body.insertAdjacentHTML("beforeend", lightboxHTML);
	}

	// Get lightbox elements
	const lightboxContainer = document.getElementById("lightbox-container");
	const lightboxImage = document.getElementById("lightbox-image");
	const lightboxCaption = document.getElementById("lightbox-caption");
	const prevButton = document.getElementById("lightbox-prev");
	const nextButton = document.getElementById("lightbox-next");
	const closeButton = document.getElementById("lightbox-close");

	// Get all gallery images
	const galleryImages = document.querySelectorAll(".gallery-item img");
	if (galleryImages.length === 0) return;

	// Array to store all gallery images data
	const galleryData = [];

	// Add click event to each gallery image
	galleryImages.forEach((img, index) => {
		// Get the caption from the next sibling .gallery-caption element
		const captionEl = img
			.closest(".gallery-item")
			.querySelector(".gallery-caption");
		const captionTitle = captionEl
			? captionEl.querySelector("h3").textContent
			: "";
		const captionText = captionEl
			? captionEl.querySelector("p").textContent
			: "";

		// Store image data
		galleryData.push({
			src: img.src,
			alt: img.alt,
			title: captionTitle,
			description: captionText,
		});

		// Make the image clickable
		img.style.cursor = "pointer";
		img.setAttribute("data-index", index);

		img.addEventListener("click", function (e) {
			openLightbox(index);
		});
	});

	// Current image index
	let currentIndex = 0;

	// Open lightbox function
	function openLightbox(index) {
		currentIndex = index;
		updateLightboxContent();
		lightboxContainer.style.display = "flex";
		document.body.style.overflow = "hidden"; // Prevent scrolling

		// Add keyboard event listener
		document.addEventListener("keydown", handleKeyboardNavigation);
	}

	// Update lightbox content
	function updateLightboxContent() {
		const data = galleryData[currentIndex];
		lightboxImage.src = data.src;
		lightboxImage.alt = data.alt;

		// Update caption
		lightboxCaption.innerHTML = `
		<h3>${data.title}</h3>
		<p>${data.description}</p>
	  `;

		// Update button states (disable if at the end)
		prevButton.style.visibility = currentIndex > 0 ? "visible" : "hidden";
		nextButton.style.visibility =
			currentIndex < galleryData.length - 1 ? "visible" : "hidden";
	}

	// Close lightbox function
	function closeLightbox() {
		lightboxContainer.style.display = "none";
		document.body.style.overflow = "auto"; // Restore scrolling
		document.removeEventListener("keydown", handleKeyboardNavigation);
	}

	// Navigate to previous image
	function prevImage() {
		if (currentIndex > 0) {
			currentIndex--;
			updateLightboxContent();
		}
	}

	// Navigate to next image
	function nextImage() {
		if (currentIndex < galleryData.length - 1) {
			currentIndex++;
			updateLightboxContent();
		}
	}

	// Handle keyboard navigation
	function handleKeyboardNavigation(e) {
		switch (e.key) {
			case "ArrowLeft":
				prevImage();
				break;
			case "ArrowRight":
				nextImage();
				break;
			case "Escape":
				closeLightbox();
				break;
		}
	}

	// Add event listeners to lightbox buttons
	prevButton.addEventListener("click", prevImage);
	nextButton.addEventListener("click", nextImage);
	closeButton.addEventListener("click", closeLightbox);

	// Close when clicking outside the image
	lightboxContainer.addEventListener("click", function (e) {
		if (e.target === lightboxContainer) {
			closeLightbox();
		}
	});
}

// Add the lightbox initialization to the DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
	// Other initializations...
	initSmoothScroll();
	initAnimations();
	initActiveNavLinks();
	initLanguageSwitcher();
	initLazyLoadImages();
	initVideoOptimization();
	initLightbox(); // Add this line
});

// Lightbox functionality for portfolio page
function initPortfolioLightbox() {
	// Create lightbox container if it doesn't exist
	if (!document.getElementById("portfolio-lightbox")) {
		const lightboxHTML = `
		<div id="portfolio-lightbox" class="lightbox-container">
		  <div class="lightbox-content">
			<img id="lightbox-image" class="lightbox-image" src="" alt="Full-size image">
			<div id="lightbox-caption" class="lightbox-caption"></div>
		  </div>
		  <button id="lightbox-close" class="lightbox-close" aria-label="Close lightbox">×</button>
		</div>
	  `;
		document.body.insertAdjacentHTML("beforeend", lightboxHTML);
	}

	// Get lightbox elements
	const lightbox = document.getElementById("portfolio-lightbox");
	const lightboxImage = document.getElementById("lightbox-image");
	const lightboxCaption = document.getElementById("lightbox-caption");
	const closeButton = document.getElementById("lightbox-close");

	// Find all gallery images
	const galleryImages = document.querySelectorAll(".gallery-item img");

	// Add click event to each gallery image
	galleryImages.forEach((img) => {
		img.style.cursor = "pointer";
		img.addEventListener("click", function () {
			// Use the same image source, or you could point to a full-resolution version
			lightboxImage.src = this.src;

			// Get caption from the parent gallery item
			const caption =
				this.closest(".gallery-item").querySelector(".gallery-caption");
			if (caption) {
				const title = caption.querySelector("h3")
					? caption.querySelector("h3").textContent
					: "";
				const description = caption.querySelector("p")
					? caption.querySelector("p").textContent
					: "";
				lightboxCaption.innerHTML = `<strong>${title}</strong><br>${description}`;
			} else {
				lightboxCaption.textContent = "";
			}

			// Show lightbox
			lightbox.classList.add("show");
		});
	});

	// Close lightbox when close button is clicked
	closeButton.addEventListener("click", () => {
		lightbox.classList.remove("show");
	});

	// Close lightbox when clicking outside the image
	lightbox.addEventListener("click", (e) => {
		if (e.target === lightbox) {
			lightbox.classList.remove("show");
		}
	});

	// Close lightbox with ESC key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && lightbox.classList.contains("show")) {
			lightbox.classList.remove("show");
		}
	});
}

// Add lightbox initialization to DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
	// Existing initializations...
	initPortfolioLightbox();
});
