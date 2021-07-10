const keys = [
	"news",
	"bookmarks",
	"topSites",
	"doodle",
	"joke",
];
const ready = (callback) => {
	if (document.readyState != "loading") callback();
	else
		document.addEventListener("DOMContentLoaded", callback);
};

const restore_options = async () => {
	await chrome.storage.sync.get(keys, function (items) {
		keys.map((key) => {
			document.getElementById(key).checked = items[key];
			console.log(key, items[key]);
		});
	});
	chrome.storage.sync.get("dark", function (item) {
		if (item["dark"] === true) {
			document.getElementById("dark").checked = true;
			document.getElementById("light").checked = false;
		} else {
			document.getElementById("dark").checked = false;
			document.getElementById("light").checked = true;
		}
	});
};

const save_options = () => {
	keys.map(async (key) => {
		let value = document.getElementById(key).checked;
		let obj = {};
		obj[key] = value;
		if (key == "topSites" || key == "bookmarks") {
			if (value == false) {
				await chrome.permissions.remove(
					{ permissions: [key] },
					function (removed) {
						if (removed) {
							chrome.storage.sync.set(obj);
						} else {
							document.getElementById(key).checked = true;
						}
					}
				);
			} else {
				await chrome.permissions.request(
					{ permissions: [key] },
					function (granted) {
						if (granted) {
							chrome.storage.sync.set(obj);
						} else {
							document.getElementById(key).checked = false;
						}
					}
				);
			}
		} else {
			chrome.storage.sync.set(obj);
			console.log(obj);
		}
		return;
	});
	const theme = document.querySelector(
		'input[name="theme"]:checked'
	).value;
	if (theme === "dark") {
		chrome.storage.sync.set({ dark: true });
	} else {
		chrome.storage.sync.set({ dark: false });
	}
};

const setTheme = () => {
	chrome.storage.sync.get("dark", function (item) {
		if (item["dark"]) {
			document
				.querySelector("body")
				.classList.remove("light_body");
			document
				.querySelector(".section")
				.classList.remove("light_section");
			document
				.querySelector("body")
				.classList.add("dark_body");
			document
				.querySelector(".section")
				.classList.add("dark_section");
			document.querySelector("a").classList.add("a_dark");
			document
				.querySelector("a")
				.classList.remove("a_light");
		} else {
			document
				.querySelector("body")
				.classList.remove("dark_body");
			document
				.querySelector(".section")
				.classList.remove("dark_section");
			document
				.querySelector("body")
				.classList.add("light_body");
			document
				.querySelector(".section")
				.classList.add("light_section");
			document
				.querySelector("a")
				.classList.remove("a_dark");
			document.querySelector("a").classList.add("a_light");
		}
	});
};
ready(() => {
	setTheme();
	document.getElementById("year").innerHTML =
		new Date().getFullYear();
	restore_options();
	document
		.getElementById("submit")
		.addEventListener("click", save_options);
});
