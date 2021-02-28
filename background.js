chrome.runtime.onInstalled.addListener(function () {
    const keys = ["news", "bookmarks", "topsites", "doodle", "dark"];
    keys.map((key) => {
        chrome.storage.sync.get(key, function (result) {
            if (!result[key]) {
                let obj = {};
                obj[key] = true;
                chrome.storage.sync.set(obj);
            }
        });
    });
});

const reloadNewTab = async () => {
    await chrome.tabs.query({title: "New tab"}, (tabs) => {
        tabs.map((tab) => {
            chrome.tabs.reload(tab.id);
        });
    });

    chrome.tabs.query({title: "xkcd new tab options"}, (tabs) => {
        tabs.map((tab) => {
            chrome.tabs.reload(tab.id);
        });
    });
}

chrome.bookmarks.onChanged.addListener(function() {
    reloadNewTab();
});

chrome.bookmarks.onChildrenReordered.addListener(function() {
    reloadNewTab();
});

chrome.bookmarks.onCreated.addListener(function() {
    reloadNewTab();
});

chrome.bookmarks.onMoved.addListener(function() {
    reloadNewTab();
});

chrome.bookmarks.onRemoved.addListener(function() {
    reloadNewTab();
});

chrome.storage.onChanged.addListener(function(){
    reloadNewTab();
});

