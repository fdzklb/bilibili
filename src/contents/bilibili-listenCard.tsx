import styleText from "data-text:@/global.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import React from "react"

import "../global.css"

import ListenSubtitle from "@/components/ListenCard"
import { usePreventKeyboardPropagation } from "@/hooks/usePreventKeyboardPropagation"
import { PauseCircle } from "lucide-react"

// 配置content script注入的方式
export const config: PlasmoCSConfig = {
  matches: ["https://www.bilibili.com/video/*"], // 只在B站视频页面生效
  all_frames: true, // 所有的iframe都生效
  run_at: "document_end" // 脚本在页面加载完成后执行
}

// 定义脚本挂在到页面的位置和方式 使用shaddow dom的方式挂在到页面上
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export const getShadowHostId = () => {
  return "bilibili-listenCard"
}

export default function BilibiliListenCard() {
  const [isOpen, setIsOpen] = React.useState(false) // 控制卡片是否已经开启 鼠标右键页面点击插件图标时会触发
  const [showCard, setShowCard] = React.useState(true) // 控制卡片的显示隐藏 隐藏时在页面右侧显示一个暂停按钮 点击后显示卡片

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
    <React.Fragment>
      {/* 展示的卡片 */}
      <ListenSubtitle setShowCard={setShowCard} showCard={showCard} />
      {/* 隐藏展示的悬浮球 */}
      <div
        className="fixed right-0 top-1/2 transform -translate-y-1/2 hover:opacity-80 transition-opacity"
        style={{ visibility: showCard ? "hidden" : "visible" }}
        draggable="true"
        onClick={() => {
          setShowCard(true)
        }}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", "")
        }}
        onDrag={(e) => {
          if (!e.clientY) return
          const element = e.target as HTMLElement
          element.style.top = `${e.clientY}px`
        }}>
        <div className="bg-primary/80 text-white p-2 rounded-l-md shadow-lg cursor-pointer">
          <PauseCircle className="w-6 h-6" />
        </div>
      </div>
    </React.Fragment>
  ) : null
}
