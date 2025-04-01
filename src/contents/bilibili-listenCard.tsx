import styleText from "data-text:@/global.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import React from "react"
import "../global.css"
import ListenSubtitle from "@/components/ListenCard"
import { PauseCircle } from "lucide-react"
import { usePreventKeyboardPropagation } from "@/hooks/usePreventKeyboardPropagation"

// 配置content script
export const config: PlasmoCSConfig = {
  matches: ["https://www.bilibili.com/video/*"], // 只在B站视频页面生效
  all_frames: true,
  run_at: "document_end"
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export const getShadowHostId = () => {
  return "bilibili-listenCard"
}

export default function BilibiliListenCard() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [showCard, setShowCard] = React.useState(true)

  // 阻止键盘事件冒泡
  usePreventKeyboardPropagation(isOpen)
  // 监听来自background的消息
  React.useEffect(() => {
    const messageListener = (message: { action: string }) => {
      // 处理打开精听模式的消息
      if (message.action === "openListenCard") {
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
     (
      <><ListenSubtitle setShowCard={setShowCard} showCard={showCard} /><div
        className="fixed right-0 top-1/2 transform -translate-y-1/2 hover:opacity-80 transition-opacity"
        style={{ visibility: showCard ? "hidden" : "visible" }}
        draggable="true"
        onClick={() => {
          setShowCard(true)
        } }
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", "")
        } }
        onDrag={(e) => {
          if (!e.clientY) return
          const element = e.target as HTMLElement
          element.style.top = `${e.clientY}px`
        } }>
        <div className="bg-primary/80 text-white p-2 rounded-l-md shadow-lg cursor-pointer">
          <PauseCircle className="w-6 h-6" />
        </div>
      </div></>
    ) 
  ) : null
}
