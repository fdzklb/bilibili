// console.log(111)
// document.addEventListener("DOMContentLoaded", function () {
//     console.log('DOMContentLoaded');

//   // 获取dom元素
//   chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//       if (request.action === "getVedio") {
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
//   document.addEventListener("keydown", function (event) {
//     if (event.shiftKey && event.key === "ArrowLeft") {
//       chrome.runtime.sendMessage({ action: "previous" })
//     } else if (event.shiftKey && event.key === "ArrowRight") {
//       chrome.runtime.sendMessage({ action: "next" })
//     }
//   })
// })
