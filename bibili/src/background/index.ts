import content from 'url:~/content/content.tsx'

const initngc = () => {

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
          sendResponse(response)
          return true
        })
      })
    }
  )

  chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
      id: "bili-bb",
      title: "视频分片重播",
      type: "normal",
      contexts: ["all"], // 或者更具体的上下文如 "selection", "link", "image" 等
    })

    // 监听点击
    chrome.contextMenus.onClicked.addListener(function (info, tab) {
      console.log(info, 'info')
      if (info.menuItemId === "bili-bb") {
        console.log('监听到点击右键ß')
        chrome.tabs.sendMessage(tab.id, { action: "show" }, function (response) {
          return true
        })
        // chrome.tabs.query(
        //   { active: true, currentWindow: true },
        //   function (tabs) {
        //     console.log('bac发出信息')
        //     chrome.tabs.sendMessage(tabs[0].id, { action: "show", function (response) {
        //       return true
        //     }})

        //     // if (tabs[0].url?.startsWith("chrome://")) return undefined;
        //     // // 获取tab的url
        //     // if (tabs[0].url && tabs[0].url.includes("bilibili.com/video/")) {
        //     //   chrome.scripting.executeScript({
        //     //     target: { tabId: tabs[0].id },
        //     //     world: "MAIN",
        //     //     files: [content],
        //     //   })
        //     // }
        //     // chrome.scripting.executeScript(
        //     //   {
        //     //     target: {
        //     //       tabId: tabs[0].id ,
        //     //     },
        //     //     world: "MAIN", // MAIN to access the window object
        //     //     func: () => {console.log(111111)} // function to inject
        //     //   },
        //     //   () => {
        //     //     console.log("Background script got callback after injection")
        //     //   }
        //     // )
        //   }
        // )
      }
    })
})
}

initngc()
export {}
