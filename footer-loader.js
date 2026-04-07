const footerMountNode = document.querySelector("#site-footer");

if (footerMountNode) {
	fetch("footer.html")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Unable to load footer partial.");
			}
			return response.text();
		})
		.then((markup) => {
			const parser = new DOMParser();
			const parsedDoc = parser.parseFromString(markup, "text/html");
			const footer = parsedDoc.querySelector("footer.clinic-footer") || parsedDoc.body.firstElementChild;

			if (!footer) {
				throw new Error("Footer markup not found in footer.html.");
			}

			footerMountNode.innerHTML = footer.outerHTML;
		})
		.catch((error) => {
			console.error(error);
		});
}
