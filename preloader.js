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
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bootLoader);
	} else {
		bootLoader();
	}
})();
