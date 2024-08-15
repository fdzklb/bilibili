// window.addEventListener("DOMContentLoaded", () => {
//   console.log(
//     "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
//   )
  // 获取dom元素
//   chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//       if (request.action === "getVedio") {
//         console.log("1122")
//         // 在这里处理 DOM 元素数据
//         const vedioRef = document.getElementsByClassName(
//           "bpx-player-video-wrap"
//         )[0].children[0]
//         sendResponse({ domElement: vedioRef })
//       }
//     }
//   )
//   // 快捷键监听
//   // Shift + Left 上一段
//   // Shift + Right 下一段
//   window.addEventListener("keydown", function (event) {
//     if (event.shiftKey && event.key === "ArrowLeft") {
//       chrome.runtime.sendMessage({ action: "previous" })
//     } else if (event.shiftKey && event.key === "ArrowRight") {
//       chrome.runtime.sendMessage({ action: "next" })
//     }
//   })
// })

import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.bilibili.com/*"]
}

window.addEventListener("load", () => {
  console.log(
    "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
  )

  document.body.style.background = "pink"
    // 获取dom元素
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.action === "getVedio") {
        console.log("1122")
        // 在这里处理 DOM 元素数据
        const vedioRef = document.getElementsByClassName(
          "bpx-player-video-wrap"
        )[0].children[0]
        sendResponse({ domElement: vedioRef })
      }
    }
  )
  // 快捷键监听
  // Shift + Left 上一段
  // Shift + Right 下一段
  window.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.key === "ArrowLeft") {
      chrome.runtime.sendMessage({ action: "previous" })
    } else if (event.shiftKey && event.key === "ArrowRight") {
      chrome.runtime.sendMessage({ action: "next" })
    }
  })
})