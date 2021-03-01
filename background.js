chrome.runtime.onInstalled.addListener(function () {
    const keys = ["news", "doodle", "topSites", "bookmarks", "dark"];
    chrome.storage.sync.clear();
    keys.map((key) => {
        chrome.storage.sync.get(key, function (result) {
            if (!result[key]) {
                let obj = {};
                if (key == "topSites" || key == "bookmarks") {
                    obj[key] = false;
                    chrome.storage.sync.set(obj);
                } else {
                    obj[key] = true;
                    chrome.storage.sync.set(obj);
                }
            }
        });
    });
});

const reloadNewTab = async () => {
    await chrome.tabs.query({ title: "New tab" }, (tabs) => {
        tabs.map((tab) => {
            chrome.tabs.reload(tab.id);
        });
    });

    chrome.tabs.query({ title: "xkcd new tab options" }, (tabs) => {
        tabs.map((tab) => {
            chrome.tabs.reload(tab.id);
        });
    });
}

chrome.permissions.onRemoved.addListener(function () {
    reloadNewTab();
});

chrome.permissions.onAdded.addListener(function () {
    reloadNewTab();
});

chrome.permissions.contains({
    permissions: ['bookmarks']
}, function (result) {
    if (result) {
        chrome.bookmarks.onChanged.addListener(function () {
            reloadNewTab();
        });

        chrome.bookmarks.onChildrenReordered.addListener(function () {
            reloadNewTab();
        });

        chrome.bookmarks.onCreated.addListener(function () {
            reloadNewTab();
        });

        chrome.bookmarks.onMoved.addListener(function () {
            reloadNewTab();
        });

        chrome.bookmarks.onRemoved.addListener(function () {
            reloadNewTab();
        });

    }
});


chrome.storage.onChanged.addListener(function () {
    reloadNewTab();
});

