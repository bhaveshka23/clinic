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
	const navLinks = document.querySelectorAll(".menu a");

	navLinks.forEach((link) => {
		const href = link.getAttribute("href");
		if (href === currentPage) {
			link.classList.add("active");
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
		})
		.catch((error) => {
			console.error(error);
		});
}
