// Optimized version of script.js
document.addEventListener("DOMContentLoaded", function () {
	// Consolidate all initializations
	initBasePathConfiguration();
	initCssVersioning();
	initSmoothScroll();
	initAnimations();
	initActiveNavLinks();
	initLanguageSwitcher();
	initMediaOptimization(); // Combined lazy loading of images and videos
	initLightbox(); // Combined both lightbox implementations
	//initMobileNavigation();
	initFormValidation();
});

// Base path configuration - helps work in both local and production environments
function initBasePathConfiguration() {
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
			if (currentPath && currentPath.startsWith("http")) return;

			// Replace the leading slash with the appropriate base path
			if (currentPath) {
				const newPath = currentPath.replace(/^\//, basePath);
				el.setAttribute(attrName, newPath);
			}
		});
}

// Add CSS versioning to prevent caching issues
function initCssVersioning() {
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
}

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

// Animation on scroll - using Intersection Observer
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
		".card, .gallery-item, .video-section, .about-section, .contact, .cta-section, .faq-item"
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
		// Skip language switcher links
		if (link.classList.contains("language-link")) {
			return;
		}

		// Get the href attribute
		const linkHref = link.getAttribute("href");
		if (!linkHref) return;

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
			link.setAttribute(
				"aria-label",
				`Current page: ${link.textContent.trim()}`
			);
		} else {
			link.removeAttribute("aria-current");
			link.setAttribute("aria-label", link.textContent.trim());
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
	  <span class="language-divider" aria-hidden="true">|</span>
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
		container.setAttribute("aria-label", "Language selector");
	});
}

// Combined function for lazy loading media (images and videos)
function initMediaOptimization() {
	// Exit early if Intersection Observer is not supported
	if (!("IntersectionObserver" in window)) {
		return;
	}

	// Create a single observer for both images and videos
	const mediaObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const element = entry.target;

					// Handle different types of media
					if (element.tagName === "IMG") {
						// Handle images
						const dataSrc = element.getAttribute("data-src");
						if (dataSrc) {
							element.src = dataSrc;
							element.removeAttribute("data-src");
						}

						element.classList.add("loaded");
					} else if (element.tagName === "VIDEO") {
						// Handle videos
						const sources = element.querySelectorAll("source");
						sources.forEach((source) => {
							const dataSrc = source.getAttribute("data-src");
							if (dataSrc) {
								source.src = dataSrc;
								source.removeAttribute("data-src");
							}
						});

						// Load the video
						element.load();
					}

					// Unobserve the element after handling it
					mediaObserver.unobserve(element);
				}
			});
		},
		{
			rootMargin: "200px 0px", // Load media when it's within 200px of viewport
			threshold: 0.01, // Trigger when even a tiny part is visible
		}
	);

	// Observe all lazyload images
	document.querySelectorAll("img[loading='lazy']").forEach((img) => {
		mediaObserver.observe(img);
	});

	// Observe all videos
	document.querySelectorAll("video").forEach((video) => {
		mediaObserver.observe(video);
	});
}

// Combined lightbox functionality
function initLightbox() {
	try {
		// Create lightbox container if it doesn't exist
		if (!document.getElementById("lightbox-container")) {
			const lightboxHTML = `
		  <div id="lightbox-container" class="lightbox-container" role="dialog" aria-modal="true" aria-label="Image Lightbox">
			<div class="lightbox-content">
			  <img id="lightbox-image" class="lightbox-image" src="" alt="Full-size image">
			  <div id="lightbox-caption" class="lightbox-caption"></div>
			</div>
			<button id="lightbox-prev" class="lightbox-prev" aria-label="Previous image">❮</button>
			<button id="lightbox-next" class="lightbox-next" aria-label="Next image">❯</button>
			<button id="lightbox-close" class="lightbox-close" aria-label="Close lightbox">×</button>
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

		// Check if all required elements exist
		if (
			!lightboxContainer ||
			!lightboxImage ||
			!lightboxCaption ||
			!prevButton ||
			!nextButton ||
			!closeButton
		) {
			console.error(
				"Lightbox initialization failed: required elements not found."
			);
			return;
		}

		// Get all gallery images
		const galleryImages = document.querySelectorAll(".gallery-item img");
		if (galleryImages.length === 0) return;

		// Array to store all gallery images data
		const galleryData = [];

		// Add click event to each gallery image
		galleryImages.forEach((img, index) => {
			try {
				// Get the caption from the gallery-caption element within the same gallery-item
				const galleryItem = img.closest(".gallery-item");
				if (!galleryItem) return;

				const captionEl = galleryItem.querySelector(".gallery-caption");

				// Safely extract caption text
				let captionTitle = "";
				let captionText = "";

				if (captionEl) {
					const titleEl = captionEl.querySelector("h3");
					const textEl = captionEl.querySelector("p");

					captionTitle = titleEl ? titleEl.textContent.trim() : "";
					captionText = textEl ? textEl.textContent.trim() : "";
				}

				// Store image data
				galleryData.push({
					src: img.src || "",
					alt: img.alt || "Gallery image",
					title: captionTitle,
					description: captionText,
				});

				// Make the image clickable
				img.style.cursor = "pointer";
				img.setAttribute("data-index", index);
				img.setAttribute(
					"aria-label",
					`View larger image: ${captionTitle || "Gallery image"}`
				);
				img.setAttribute("tabindex", "0"); // Make focusable

				// Add click and keypress event listeners
				img.addEventListener("click", function () {
					openLightbox(index);
				});

				img.addEventListener("keydown", function (e) {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						openLightbox(index);
					}
				});
			} catch (err) {
				console.error("Error processing gallery image:", err);
			}
		});

		// Current image index
		let currentIndex = 0;

		// Open lightbox function with error handling
		function openLightbox(index) {
			try {
				if (index < 0 || index >= galleryData.length) {
					console.error("Invalid image index:", index);
					return;
				}

				currentIndex = index;
				updateLightboxContent();
				lightboxContainer.style.display = "flex";
				document.body.style.overflow = "hidden"; // Prevent scrolling

				// Set focus to lightbox
				closeButton.focus();

				// Add keyboard event listener
				document.addEventListener("keydown", handleKeyboardNavigation);
			} catch (err) {
				console.error("Error opening lightbox:", err);
				// Try to reset state if there's an error
				try {
					lightboxContainer.style.display = "none";
					document.body.style.overflow = "auto";
				} catch (resetErr) {
					console.error("Error resetting after lightbox error:", resetErr);
				}
			}
		}

		// Update lightbox content with error handling
		function updateLightboxContent() {
			try {
				if (currentIndex < 0 || currentIndex >= galleryData.length) {
					console.error("Invalid currentIndex:", currentIndex);
					return;
				}

				const data = galleryData[currentIndex];
				if (!data) {
					console.error("No data found for currentIndex:", currentIndex);
					return;
				}

				// Safely update image - IMPORTANT: Preload the image to prevent freezing
				const tempImage = new Image();
				tempImage.onload = function () {
					lightboxImage.src = this.src;
					lightboxImage.alt = data.alt || "Gallery image";

					// Update caption after image loads
					lightboxCaption.innerHTML = `
			  <h3>${data.title || ""}</h3>
			  <p>${data.description || ""}</p>
			`;

					// Update buttons only after image loads
					updateNavigationButtons();
				};

				tempImage.onerror = function () {
					console.error("Error loading image:", data.src);
					lightboxImage.src = "";
					lightboxImage.alt = "Image failed to load";
					lightboxCaption.innerHTML = `
			  <h3>${data.title || ""}</h3>
			  <p>The image could not be loaded</p>
			`;
					updateNavigationButtons();
				};

				// Start loading the image
				tempImage.src = data.src || "";

				// Show loading state
				lightboxImage.style.opacity = "0.5";
			} catch (err) {
				console.error("Error updating lightbox content:", err);
			}
		}

		// Update navigation buttons separately
		function updateNavigationButtons() {
			try {
				// Restore image opacity
				lightboxImage.style.opacity = "1";

				// Update button states (disable if at the end)
				prevButton.style.visibility = currentIndex > 0 ? "visible" : "hidden";
				prevButton.disabled = currentIndex === 0;

				nextButton.style.visibility =
					currentIndex < galleryData.length - 1 ? "visible" : "hidden";
				nextButton.disabled = currentIndex === galleryData.length - 1;

				// Update aria labels
				lightboxContainer.setAttribute(
					"aria-label",
					`Image ${currentIndex + 1} of ${galleryData.length}: ${
						galleryData[currentIndex].title || ""
					}`
				);
			} catch (err) {
				console.error("Error updating navigation buttons:", err);
			}
		}

		// Close lightbox function with error handling
		function closeLightbox() {
			try {
				lightboxContainer.style.display = "none";
				document.body.style.overflow = "auto"; // Restore scrolling
				document.removeEventListener("keydown", handleKeyboardNavigation);

				// Return focus to the triggering image
				try {
					const originalImage = document.querySelector(
						`.gallery-item img[data-index="${currentIndex}"]`
					);
					if (originalImage) {
						originalImage.focus();
					}
				} catch (focusErr) {
					console.error("Error focusing original image:", focusErr);
				}
			} catch (err) {
				console.error("Error closing lightbox:", err);
				// Force reset in case of error
				document.body.style.overflow = "auto";
			}
		}

		// Navigate to previous image with error handling
		function prevImage() {
			try {
				if (currentIndex > 0) {
					currentIndex--;
					updateLightboxContent();
				}
			} catch (err) {
				console.error("Error navigating to previous image:", err);
			}
		}

		// Navigate to next image with error handling
		function nextImage() {
			try {
				if (currentIndex < galleryData.length - 1) {
					currentIndex++;
					updateLightboxContent();
				}
			} catch (err) {
				console.error("Error navigating to next image:", err);
			}
		}

		// Handle keyboard navigation with error handling
		function handleKeyboardNavigation(e) {
			try {
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
			} catch (err) {
				console.error("Error handling keyboard navigation:", err);
				// Try to reset on error
				try {
					closeLightbox();
				} catch (resetErr) {
					console.error(
						"Error resetting after keyboard navigation error:",
						resetErr
					);
				}
			}
		}

		// Add event listeners to lightbox buttons with error handling
		prevButton.addEventListener("click", function (e) {
			try {
				prevImage();
			} catch (err) {
				console.error("Error on prev button click:", err);
			}
		});

		nextButton.addEventListener("click", function (e) {
			try {
				nextImage();
			} catch (err) {
				console.error("Error on next button click:", err);
			}
		});

		closeButton.addEventListener("click", function (e) {
			try {
				closeLightbox();
			} catch (err) {
				console.error("Error on close button click:", err);
			}
		});

		// Close when clicking outside the image with error handling
		lightboxContainer.addEventListener("click", function (e) {
			try {
				if (e.target === lightboxContainer) {
					closeLightbox();
				}
			} catch (err) {
				console.error("Error on lightbox container click:", err);
				// Force reset in case of error
				try {
					document.body.style.overflow = "auto";
					lightboxContainer.style.display = "none";
				} catch (resetErr) {
					console.error(
						"Error resetting after container click error:",
						resetErr
					);
				}
			}
		});
	} catch (err) {
		console.error("Error initializing lightbox:", err);
	}
}

// Form validation
function initFormValidation() {
	const contactForm = document.getElementById("contact-form");
	const formStatus = document.getElementById("form-status");

	if (!contactForm) return;

	// Add validation feedback
	const inputs = contactForm.querySelectorAll(
		"input[required], textarea[required]"
	);
	inputs.forEach((input) => {
		// Add blur event listeners for validation feedback
		input.addEventListener("blur", function () {
			validateInput(this);
		});

		// Add input event listeners to clear validation errors when typing
		input.addEventListener("input", function () {
			if (this.classList.contains("invalid")) {
				validateInput(this);
			}
		});
	});

	// Add submit event handler with validation
	contactForm.addEventListener("submit", function (e) {
		e.preventDefault();

		// Validate all required fields
		let isValid = true;
		inputs.forEach((input) => {
			if (!validateInput(input)) {
				isValid = false;
			}
		});

		if (!isValid) {
			formStatus.innerHTML =
				'<div class="error">Please fill in all required fields correctly.</div>';
			return;
		}

		// Proceed with form submission
		submitForm(contactForm, formStatus);
	});

	function validateInput(input) {
		let isValid = true;
		let errorMessage = "";

		// Remove any existing validation message
		const existingErrorSpan =
			input.parentNode.querySelector(".validation-error");
		if (existingErrorSpan) {
			existingErrorSpan.remove();
		}

		// Check validity based on type
		if (input.type === "email") {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			isValid = emailPattern.test(input.value);
			errorMessage = "Please enter a valid email address";
		} else if (input.tagName === "TEXTAREA") {
			isValid = input.value.trim().length > 10;
			errorMessage = "Please enter a message with at least 10 characters";
		} else if (input.type === "checkbox") {
			isValid = input.checked;
			errorMessage = "Please check this box to proceed";
		} else {
			isValid = input.value.trim() !== "";
			errorMessage = "This field is required";
		}

		// Apply validation styling
		if (!isValid) {
			input.classList.add("invalid");
			input.classList.remove("valid");

			// Add error message
			const errorSpan = document.createElement("span");
			errorSpan.className = "validation-error";
			errorSpan.textContent = errorMessage;
			input.parentNode.appendChild(errorSpan);
		} else {
			input.classList.remove("invalid");
			input.classList.add("valid");
		}

		return isValid;
	}

	function submitForm(form, statusElement) {
		const formData = new FormData(form);
		const url = form.getAttribute("action");

		statusElement.innerHTML = '<div class="loading">Sending message...</div>';

		fetch(url, {
			method: "POST",
			body: formData,
			headers: {
				Accept: "application/json",
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`Network error: ${response.status} ${response.statusText}`
					);
				}
				return response.json();
			})
			.then((data) => {
				if (data.ok) {
					form.reset();
					statusElement.innerHTML =
						'<div class="success">Thank you! Your message has been sent. We\'ll get back to you shortly.</div>';

					// Remove validation styling
					form.querySelectorAll(".valid, .invalid").forEach((el) => {
						el.classList.remove("valid", "invalid");
					});
				} else {
					throw new Error(data.error || "Form submission was not successful");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				statusElement.innerHTML = `<div class="error">There was a problem sending your message: ${error.message}. Please try again or contact us directly.</div>`;
			});
	}
}

// Fixed Cookie Consent Functionality
function initCookieConsent() {
	// First check if consent was already given before doing anything else
	const consentGiven = getCookie("cookie_consent");

	// If consent was already given, don't show the banner at all
	if (consentGiven) {
		// Apply saved preferences immediately
		const preferences = JSON.parse(consentGiven);

		// Load scripts based on preferences
		if (preferences.analytics) {
			loadAnalyticsScripts();
		}

		if (preferences.marketing) {
			loadMarketingScripts();
		}

		// Exit early - don't create or show the banner
		return;
	}

	// Determine current language from URL path
	let currentPath = window.location.pathname;
	let currentLang = currentPath.includes("/no/") ? "no" : "en";

	// Select the appropriate banner HTML based on language
	const cookieBannerHTML =
		currentLang === "no" ? cookieBannerHTML_NO : cookieBannerHTML_EN;

	// Create cookie banner HTML only if consent hasn't been given
	// English version
	const cookieBannerHTML_EN = `
	  <div class="cookie-consent" id="cookie-banner">
		<div class="cookie-text">
		  <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.</p>
		</div>
		<div class="cookie-buttons">
		  <button class="cookie-btn settings" id="cookie-settings">Cookie Settings</button>
		  <button class="cookie-btn accept" id="cookie-accept">Accept All</button>
		</div>
	  </div>
	  
	  <div class="cookie-modal" id="cookie-modal">
		<div class="cookie-modal-content">
		  <button class="cookie-modal-close" id="cookie-modal-close" aria-label="Close cookie settings">×</button>
		  <h3>Cookie Settings</h3>
		  
		  <div class="cookie-option">
			<div class="cookie-option-header">
			  <h4>Necessary Cookies</h4>
			  <label class="cookie-switch">
				<input type="checkbox" checked disabled>
				<span class="cookie-slider"></span>
			  </label>
			</div>
			<p>These cookies are essential for the website to function properly and cannot be disabled.</p>
		  </div>
		  
		  <div class="cookie-option">
			<div class="cookie-option-header">
			  <h4>Analytics Cookies</h4>
			  <label class="cookie-switch">
				<input type="checkbox" id="analytics-cookies">
				<span class="cookie-slider"></span>
			  </label>
			</div>
			<p>These cookies help us understand how visitors interact with our website, which allows us to improve your experience.</p>
		  </div>
		  
		  <div class="cookie-option">
			<div class="cookie-option-header">
			  <h4>Marketing Cookies</h4>
			  <label class="cookie-switch">
				<input type="checkbox" id="marketing-cookies">
				<span class="cookie-slider"></span>
			  </label>
			</div>
			<p>These cookies are used to track visitors across websites to display relevant advertisements.</p>
		  </div>
		  
		  <div class="cookie-modal-footer">
			<button class="cookie-modal-btn cancel" id="cookie-modal-cancel">Cancel</button>
			<button class="cookie-modal-btn save" id="cookie-modal-save">Save Preferences</button>
		  </div>
		</div>
	  </div>
	`;

	// Norwegian version
	const cookieBannerHTML_NO = `
	  <div class="cookie-consent" id="cookie-banner">
		<div class="cookie-text">
		  <p>Vi bruker informasjonskapsler for å forbedre din nettleseropplevelse, analysere nettstedstrafikk og tilpasse innhold. Ved å klikke på "Godta alle", samtykker du til vår bruk av informasjonskapsler.</p>
		</div>
		<div class="cookie-buttons">
		  <button class="cookie-btn settings" id="cookie-settings">Innstillinger</button>
		  <button class="cookie-btn accept" id="cookie-accept">Godta alle</button>
		</div>
	  </div>
	  
	  <div class="cookie-modal" id="cookie-modal">
		<div class="cookie-modal-content">
		  <button class="cookie-modal-close" id="cookie-modal-close" aria-label="Lukk innstillinger">×</button>
		  <h3>Innstillinger for informasjonskapsler</h3>
		  
		  <div class="cookie-option">
			<div class="cookie-option-header">
			  <h4>Nødvendige informasjonskapsler</h4>
			  <label class="cookie-switch">
				<input type="checkbox" checked disabled>
				<span class="cookie-slider"></span>
			  </label>
			</div>
			<p>Disse informasjonskapslene er nødvendige for at nettstedet skal fungere ordentlig og kan ikke deaktiveres.</p>
		  </div>
		  
		  <div class="cookie-option">
			<div class="cookie-option-header">
			  <h4>Analyseinformasjonskapsler</h4>
			  <label class="cookie-switch">
				<input type="checkbox" id="analytics-cookies">
				<span class="cookie-slider"></span>
			  </label>
			</div>
			<p>Disse informasjonskapslene hjelper oss å forstå hvordan besøkende samhandler med nettstedet vårt, noe som gjør det mulig for oss å forbedre din opplevelse.</p>
		  </div>
		  
		  <div class="cookie-option">
			<div class="cookie-option-header">
			  <h4>Markedsføringsinformasjonskapsler</h4>
			  <label class="cookie-switch">
				<input type="checkbox" id="marketing-cookies">
				<span class="cookie-slider"></span>
			  </label>
			</div>
			<p>Disse informasjonskapslene brukes til å spore besøkende på tvers av nettsteder for å vise relevante annonser.</p>
		  </div>
		  
		  <div class="cookie-modal-footer">
			<button class="cookie-modal-btn cancel" id="cookie-modal-cancel">Avbryt</button>
			<button class="cookie-modal-btn save" id="cookie-modal-save">Lagre preferanser</button>
		  </div>
		</div>
	  </div>
	`;

	// Add banner to the page
	document.body.insertAdjacentHTML("beforeend", cookieBannerHTML);

	// Get elements
	const cookieBanner = document.getElementById("cookie-banner");
	const cookieAccept = document.getElementById("cookie-accept");
	const cookieSettings = document.getElementById("cookie-settings");
	const cookieModal = document.getElementById("cookie-modal");
	const cookieModalClose = document.getElementById("cookie-modal-close");
	const cookieModalCancel = document.getElementById("cookie-modal-cancel");
	const cookieModalSave = document.getElementById("cookie-modal-save");
	const analyticsCookies = document.getElementById("analytics-cookies");
	const marketingCookies = document.getElementById("marketing-cookies");

	// Important: Start with the banner hidden and only show it after a delay
	if (cookieBanner) {
		// Hide the banner initially (with CSS)
		cookieBanner.style.opacity = "0";
		cookieBanner.style.transform = "translateY(100%)";

		// Show the banner after a delay (to prevent flash)
		setTimeout(() => {
			cookieBanner.classList.add("show");
			cookieBanner.style.opacity = "1";
			cookieBanner.style.transform = "translateY(0)";
		}, 1000);
	}

	// Event Listeners
	if (cookieAccept) {
		cookieAccept.addEventListener("click", () => {
			// Accept all cookies
			const preferences = {
				necessary: true,
				analytics: true,
				marketing: true,
			};

			// Save preferences
			setCookie("cookie_consent", JSON.stringify(preferences), 365);

			// Hide banner
			cookieBanner.classList.remove("show");
			cookieBanner.style.opacity = "0";
			cookieBanner.style.transform = "translateY(100%)";

			// Load all scripts
			loadAnalyticsScripts();
			loadMarketingScripts();
		});
	}

	if (cookieSettings) {
		cookieSettings.addEventListener("click", () => {
			// Show settings modal
			cookieModal.classList.add("show");
		});
	}

	if (cookieModalClose) {
		cookieModalClose.addEventListener("click", () => {
			// Close modal
			cookieModal.classList.remove("show");
		});
	}

	if (cookieModalCancel) {
		cookieModalCancel.addEventListener("click", () => {
			// Close modal without saving
			cookieModal.classList.remove("show");
		});
	}

	if (cookieModalSave) {
		cookieModalSave.addEventListener("click", () => {
			// Save preferences
			const preferences = {
				necessary: true,
				analytics: analyticsCookies.checked,
				marketing: marketingCookies.checked,
			};

			// Save preferences
			setCookie("cookie_consent", JSON.stringify(preferences), 365);

			// Close modal and banner
			cookieModal.classList.remove("show");
			cookieBanner.classList.remove("show");
			cookieBanner.style.opacity = "0";
			cookieBanner.style.transform = "translateY(100%)";

			// Load scripts based on preferences
			if (preferences.analytics) {
				loadAnalyticsScripts();
			}

			if (preferences.marketing) {
				loadMarketingScripts();
			}
		});
	}
}

// Helper function to set a cookie
function setCookie(name, value, days) {
	let expires = "";

	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}

	document.cookie =
		name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

// Helper function to get a cookie
function getCookie(name) {
	const nameEQ = name + "=";
	const ca = document.cookie.split(";");

	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") {
			c = c.substring(1, c.length);
		}

		if (c.indexOf(nameEQ) === 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}

	return null;
}

// Function to load analytics scripts
function loadAnalyticsScripts() {
	// This is where you would load Google Analytics or other analytics scripts
	console.log("Analytics scripts loaded");

	// Example: loading Google Analytics
	/*
	const gaScript = document.createElement('script');
	gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID';
	gaScript.async = true;
	document.head.appendChild(gaScript);
	
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', 'YOUR-GA-ID');
	*/
}

// Function to load marketing scripts
function loadMarketingScripts() {
	// This is where you would load marketing scripts like Facebook Pixel, etc.
	console.log("Marketing scripts loaded");

	// Example: loading Facebook Pixel
	/*
	!function(f,b,e,v,n,t,s)
	{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	n.callMethod.apply(n,arguments):n.queue.push(arguments)};
	if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
	n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];
	s.parentNode.insertBefore(t,s)}(window, document,'script',
	'https://connect.facebook.net/en_US/fbevents.js');
	fbq('init', 'YOUR-PIXEL-ID');
	fbq('track', 'PageView');
	*/
}

// Add to the DOM ready function
document.addEventListener("DOMContentLoaded", function () {
	initCookieConsent();
});
