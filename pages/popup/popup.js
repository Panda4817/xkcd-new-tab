document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("dark", async function (item) {
        if (item["dark"]) {
            document.querySelector('body').classList.remove("light_body");
            document.querySelector('body').classList.add("dark_body");
            const as = document.querySelectorAll("a");
            as.forEach((a) => {
                a.classList.remove("light_text");
                a.classList.add("dark_text");
            });
        } else {
            document.querySelector('body').classList.remove("dark_body");
            document.querySelector('body').classList.add("light_body");
            const as = document.querySelectorAll("a");
            as.forEach((a) => {
                a.classList.remove("dark_text");
                a.classList.add("light_text");
            });
        }

    });
});