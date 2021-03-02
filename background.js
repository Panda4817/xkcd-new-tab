chrome.runtime.onInstalled.addListener(async function () {
    const keys = ["news", "doodle", "topSites", "bookmarks", "dark"];
    await chrome.alarms.clearAll();
    await chrome.storage.sync.clear();
    await chrome.alarms.create('checkDay', {delayInMinutes: 1, periodInMinutes: 1});
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

chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log(alarm);
    chrome.storage.sync.get('latestComic', function (value) {
        let now = new Date().toDateString();
        if (value['latestComic']["date"] != now) {
            reloadNewTab();
        } else {
            console.log(value,"up-to-date");
        }
    });
});

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

