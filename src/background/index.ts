chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "bilibiliListenCard",
    title: "去精听",
    contexts: ["page"],
    documentUrlPatterns: ["https://www.bilibili.com/video/*"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "bilibiliListenCard" && tab?.id) {
    // 向当前标签页发送开启精听的消息
    chrome.tabs.sendMessage(tab.id, {
      action: "openListenCard"
    })
  }
})
