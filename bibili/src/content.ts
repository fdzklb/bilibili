import { log } from "console"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.bilibili.com/*"]
}

let vedioDom = null
let isCircle = false
let endTime = 0

window.addEventListener("load", () => {
  vedioDom = document.getElementsByClassName("bpx-player-video-wrap")[0]
    .children[0] as HTMLVideoElement
})

// 快捷键监听
// Shift + Left 上一段
// Shift + Right 下一段
window.addEventListener("keydown", function (event) {
  if (event.shiftKey && event.key === "ArrowLeft") {
    log("shift + left")
    chrome.runtime.sendMessage({ action: "previous" }, (response) => {
      endTime = response.endTime
      vedioDom.currentTime = response.currentTime
      vedioDom.play()
    })
  } else if (event.shiftKey && event.key === "ArrowRight") {
    log("shift + right")
    chrome.runtime.sendMessage({ action: "next" }, (response) => {
      endTime = response.endTime
      vedioDom.currentTime = response.currentTime
      vedioDom.play()
    })
  }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "resetCurrentTime") {
    log("resetCurrentTime")
    log("resetCurrentTime, data", request)
    endTime = request.endTime
    vedioDom.currentTime = request.currentTime
    vedioDom.play()
  }
  if (request.action === "changeCircle") {
    log("changeCircle")
    log("changeCircle, data", request)
    isCircle = request.isCircle
  }
})
