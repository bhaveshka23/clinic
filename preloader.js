(function () {
	function createLoaderElement() {
		if (document.querySelector("#siteLoader")) {
			return document.querySelector("#siteLoader");
		}

		const loader = document.createElement("div");
		loader.id = "siteLoader";
		loader.className = "site-loader";
		loader.innerHTML = "" +
			'<div class="site-loader-content">' +
			'<img src="./images/logo.png" class="site-loader-logo" alt="Clinic logo">' +
			"<h2>Welcome to Dr. Gulshan Tolani's Clinic</h2>" +
			"<p>Preparing your care experience...</p>" +
			'<div class="site-loader-spinner" aria-hidden="true"></div>' +
			"</div>";

		document.body.appendChild(loader);
		return loader;
	}

	function showLoader() {
		const loader = createLoaderElement();
		loader.classList.add("is-visible");
	}

	function hideLoader() {
		const loader = createLoaderElement();
		loader.classList.remove("is-visible");
	}

	function shouldHandleNavigationLink(link) {
		if (!link) {
			return false;
		}
		if (link.target === "_blank" || link.hasAttribute("download")) {
			return false;
		}
		const href = (link.getAttribute("href") || "").trim();
		if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
			return false;
		}
		try {
			const targetUrl = new URL(link.href, window.location.href);
			return targetUrl.origin === window.location.origin;
		} catch (_error) {
			return false;
		}
	}

	function bindPageTransitions() {
		document.addEventListener("click", function (event) {
			const link = event.target.closest("a[href]");
			if (!shouldHandleNavigationLink(link)) {
				return;
			}

			event.preventDefault();
			sessionStorage.setItem("clinicShowTransitionLoader", "1");
			showLoader();
			setTimeout(function () {
				window.location.href = link.href;
			}, 140);
		});

		document.addEventListener("submit", function (event) {
			const form = event.target;
			if (!(form instanceof HTMLFormElement) || form.dataset.loaderSubmitted === "1") {
				return;
			}
			if (form.target && form.target.toLowerCase() === "_blank") {
				return;
			}

			event.preventDefault();
			form.dataset.loaderSubmitted = "1";
			sessionStorage.setItem("clinicShowTransitionLoader", "1");
			showLoader();
			setTimeout(function () {
				form.submit();
			}, 140);
		});
	}

	function initSiteAnimations() {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		const revealSelector = [
			"section",
			"article",
			".panel",
			".clinic-card",
			".contact-info-card",
			".about-education-card",
			".about-spec-card",
			".care-card",
			".faq-item",
			".appointment-panel",
			".doctor-profile-container",
			".welcome-card",
			".page-banner .container",
			".hero-content > *"
		].join(",");

		const revealElements = Array.from(document.querySelectorAll(revealSelector));
		revealElements.forEach(function (element, index) {
			element.classList.add("reveal-on-scroll");
			element.style.setProperty("--reveal-delay", (index % 6) * 70 + "ms");
		});

		const immediateVisible = document.querySelectorAll(".hero, .page-banner");
		immediateVisible.forEach(function (element) {
			element.classList.add("reveal-on-scroll", "is-visible");
		});

		const observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) {
					return;
				}
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			});
		}, {
			threshold: 0.15,
			rootMargin: "0px 0px -8% 0px"
		});

		revealElements.forEach(function (element) {
			if (element.classList.contains("is-visible")) {
				return;
			}
			observer.observe(element);
		});
	}

	function bootLoader() {
		const isFirstVisit = !localStorage.getItem("clinicWelcomeSeen");
		const isTransitionLoad = sessionStorage.getItem("clinicShowTransitionLoader") === "1";

		if (isFirstVisit) {
			localStorage.setItem("clinicWelcomeSeen", "1");
			sessionStorage.removeItem("clinicShowTransitionLoader");
			showLoader();
			setTimeout(hideLoader, 2200);
		} else if (isTransitionLoad) {
			sessionStorage.removeItem("clinicShowTransitionLoader");
			showLoader();
			setTimeout(hideLoader, 420);
		}

		bindPageTransitions();
		initSiteAnimations();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bootLoader);
	} else {
		bootLoader();
	}
})();
