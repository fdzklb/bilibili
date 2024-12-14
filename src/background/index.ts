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

// chrome.commands.onCommand.addListener((command) => {
//   // 处理快捷键命令
//   switch (command) {
//     case "prev_subtitle":
//       // 左方向键 - 上一句
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "prev_subtitle" })
//       })
//       break
//     case "next_subtitle":
//       // 右方向键 - 下一句
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "next_subtitle" })
//       })
//       break
//     case "toggle_raw":
//       // 上方向键 - 显示/隐藏原文
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "toggle_raw" })
//       })
//       break
//     case "toggle_translate":
//       // 下方向键 - 显示/隐藏译文
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "toggle_translate" })
//       })
//       break
//     case "toggle_loop":
//       // shift键 - 开启/关闭循环播放
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "toggle_loop" })
//       })
//       break
//     case "toggle_play":
//       // 空格键 - 播放/暂停
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "toggle_play" })
//       })
//       break
//   }
// })

