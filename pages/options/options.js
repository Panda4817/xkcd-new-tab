const keys = ["news", "bookmarks", "topsites", "doodle"];
const ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
};

const restore_options = async () => {
    await chrome.storage.sync.get(keys, function (items) {
        keys.map(key => {
            document.getElementById(key).checked = items[key];
            console.log(key, items[key])
        })
    });
    chrome.storage.sync.get("dark", function (item) {
        if (item["dark"] === true) {
            document.getElementById("dark").checked = true;
            document.getElementById("light").checked = false;
        } else {
            document.getElementById("dark").checked = false;
            document.getElementById("light").checked = true;
        }
    })
}

const save_options = () => {
    keys.map(key => {
        let value = document.getElementById(key).checked;
        let obj = {};
        obj[key] = value;
        chrome.storage.sync.set(obj);
        console.log(obj)
    });
    const theme = document.querySelector('input[name="theme"]:checked').value;
    if (theme === "dark") {
        chrome.storage.sync.set({ "dark": true });
    } else {
        chrome.storage.sync.set({ "dark": false });
    }
    window.alert("Your options are saved and if a new tab is already open it has been reloaded.");
}

const setTheme = () => {
    chrome.storage.sync.get("dark", function (item) {
        if (item["dark"]) {
            document.querySelector('body').classList.remove("light_body");
            document.querySelector('.section').classList.remove("light_section");
            document.querySelector('body').classList.add("dark_body");
            document.querySelector('.section').classList.add("dark_section");
        } else {
            document.querySelector('body').classList.remove("dark_body");
            document.querySelector('.section').classList.remove("dark_section");
            document.querySelector('body').classList.add("light_body");
            document.querySelector('.section').classList.add("light_section");
        }

    });
}
ready(() => {
    setTheme();
    document.getElementById('year').innerHTML = new Date().getFullYear();
    restore_options();
    document.getElementById('submit').addEventListener('click', save_options);
})
