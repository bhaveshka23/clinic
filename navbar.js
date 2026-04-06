const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
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
