const navbarMountNode = document.querySelector("#site-navbar");

function initNavbarAnimation() {
	const siteHeader = document.querySelector(".site-header");
	if (!siteHeader) {
		return;
	}

	let lastScrollY = window.scrollY;
	const scrollDelta = 8;

	window.addEventListener("scroll", () => {
		const currentScrollY = window.scrollY;

		if (currentScrollY <= 10) {
			siteHeader.classList.remove("is-hidden", "is-scrolled");
			lastScrollY = currentScrollY;
			return;
		}

		siteHeader.classList.add("is-scrolled");

		if (currentScrollY > lastScrollY + scrollDelta) {
			siteHeader.classList.add("is-hidden");
		} else if (currentScrollY < lastScrollY - scrollDelta) {
			siteHeader.classList.remove("is-hidden");
		}

		lastScrollY = currentScrollY;
	}, { passive: true });
}

function setActiveNavbarLink() {
	const currentPage = window.location.pathname.split("/").pop() || "index.html";
	const navLinks = document.querySelectorAll(".menu a, .sidebar-menu a");

	navLinks.forEach((link) => {
		const href = link.getAttribute("href");
		if (href === currentPage) {
			link.classList.add("active");
		}
	});
}

function initMobileSidebar() {
	const header = document.querySelector(".site-header");
	const toggleButton = document.querySelector(".nav-toggle");
	const closeButton = document.querySelector(".sidebar-close");
	const overlay = document.querySelector(".sidebar-overlay");
	const sidebar = document.querySelector(".mobile-sidebar");
	const sidebarLinks = document.querySelectorAll(".sidebar-menu a, .sidebar-cta");

	if (!header || !toggleButton || !closeButton || !overlay || !sidebar) {
		return;
	}

	const closeSidebar = () => {
		header.classList.remove("sidebar-open");
		document.body.classList.remove("sidebar-open");
		toggleButton.setAttribute("aria-expanded", "false");
		sidebar.setAttribute("aria-hidden", "true");
	};

	const openSidebar = () => {
		header.classList.add("sidebar-open");
		document.body.classList.add("sidebar-open");
		toggleButton.setAttribute("aria-expanded", "true");
		sidebar.setAttribute("aria-hidden", "false");
	};

	toggleButton.addEventListener("click", () => {
		if (header.classList.contains("sidebar-open")) {
			closeSidebar();
			return;
		}

		openSidebar();
	});

	closeButton.addEventListener("click", closeSidebar);
	overlay.addEventListener("click", closeSidebar);

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeSidebar();
		}
	});

	sidebarLinks.forEach((link) => {
		link.addEventListener("click", closeSidebar);
	});

	window.addEventListener("resize", () => {
		if (window.innerWidth > 991) {
			closeSidebar();
		}
	});
}

if (navbarMountNode) {
	fetch("navbar.html")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Unable to load navbar partial.");
			}
			return response.text();
		})
		.then((markup) => {
			navbarMountNode.innerHTML = markup;
			setActiveNavbarLink();
			initNavbarAnimation();
			initMobileSidebar();
		})
		.catch((error) => {
			console.error(error);
		});
}
