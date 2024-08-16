import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.bilibili.com/*"],
  world: 'MAIN',
  run_at: 'document_start'
}

export const getvedioDom = () => {
  let vedioDom = null
  let isCircle = true
  let currentTime = -1
  let endTime = -1

  window.addEventListener("load", () => {
    vedioDom = document.getElementsByClassName("bpx-player-video-wrap")[0]
      .children[0] as HTMLVideoElement

    // 监听视频进度
    vedioDom.addEventListener("timeupdate", () => {
      if (currentTime !== -1 && isCircle) {
        if (endTime - vedioDom.currentTime <= 0.2) {
          vedioDom.currentTime = currentTime
        }
      }
    })

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

    // 设置播放开始时间
    // 设置是够循环播放
    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        if (request.action === "resetCurrentTime") {
          endTime = request.endTime
          currentTime = request.currentTime
          vedioDom.currentTime = request.currentTime
          vedioDom.play()
        }
        if (request.action === "changeCircle") {
          isCircle = request.isCircle
        }
      }
    )
  })
}

getvedioDom()



