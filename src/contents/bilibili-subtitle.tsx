import React from "react"
import styleText from "data-text:@/global.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import "../global.css"


// 配置content script
export const config: PlasmoCSConfig = {
  matches: ["https://www.bilibili.com/video/*"], // 只在B站视频页面生效
  all_frames: false,
  run_at: "document_start"
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export const getShadowHostId = () => {
  return "bilibili-subtitle"
}

export default function BilibiliSubtitle() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [showCard, setShowCard] = React.useState(true)

  // 监听来自background的消息
  React.useEffect(() => {
    const messageListener = (message: { action: string }) => {
      // 处理打开精听模式的消息
      if (message.action === "openListenSubtitle") {
        // 触发精听模式的开启
        console.log("收到打开精听模式的消息")
        setIsOpen(true)
      }
    }

    // 添加消息监听器
    chrome.runtime.onMessage.addListener(messageListener)

    // 组件卸载时移除监听器
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [])

  return isOpen ? (
    <div>123</div>
  ) : null
}
