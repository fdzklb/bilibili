chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "biliSubtitle",
    title: "去精听",
    contexts: ["all"],
    documentUrlPatterns: ["https://www.bilibili.com/video/*"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.create({
    url: "chrome-extension://" + tab.id + "/contents/bilibili-subtitle.html"
  })
})
