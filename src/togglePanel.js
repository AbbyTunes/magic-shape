
let mainButton = document.getElementById("main-button");
let panel = document.getElementById("panel");
let closeButton = document.getElementById("close-button");

// panel.addEventListener("")

mainButton.addEventListener("click", () => {
	togglePanel();
})

closeButton.addEventListener("click", () => {
	togglePanel();
})

export function togglePanel() {
	if (mainButton.style.display === "none") {
		mainButton.style.display = "block";
		panel.style.display = "none";
	} else {
		mainButton.style.display = "none";
		panel.style.display = "block";
	}
}

var tabLinks = new Array();
var contentDivs = new Array();

// export function init() {
window.onload = function init() {

	// Grab the tab links and content divs from the page
	var tabListItems = document.getElementById('tabs').childNodes;
	for (var i = 0; i < tabListItems.length; i++) {
		if (tabListItems[i].nodeName == "LI") {
			var tabLink = getFirstChildWithTagName(tabListItems[i], 'A');
			var id = getHash(tabLink.getAttribute('href'));
			tabLinks[id] = tabLink;
			contentDivs[id] = document.getElementById(id);
		}
	}

	// Assign onclick events to the tab links, and
	// highlight the first tab
	var i = 0;

	for (var id in tabLinks) {
		tabLinks[id].onclick = showTab;
		tabLinks[id].onfocus = function () { this.blur() };
		if (i == 0) tabLinks[id].className = 'selected';
		i++;
	}

	// Hide all content divs except the first
	var i = 0;

	for (var id in contentDivs) {
		if (i != 0) contentDivs[id].className = 'tabContent hide';
		i++;
	}
}

export function showTab() {
	var selectedId = getHash(this.getAttribute('href'));

	// Highlight the selected tab, and dim all others.
	// Also show the selected content div, and hide all others.
	for (var id in contentDivs) {
		if (id == selectedId) {
			tabLinks[id].className = 'selected';
			contentDivs[id].className = 'tabContent';
		} else {
			tabLinks[id].className = '';
			contentDivs[id].className = 'tabContent hide';
		}
	}

	// Stop the browser following the link
	return false;
}

export function getFirstChildWithTagName(element, tagName) {
	for (var i = 0; i < element.childNodes.length; i++) {
		if (element.childNodes[i].nodeName == tagName) return element.childNodes[i];
	}
}

export function getHash(url) {
	var hashPos = url.lastIndexOf('#');
	return url.substring(hashPos + 1);
}
