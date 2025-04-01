import { Button, Input, Textarea } from "@/components/ui"
import type { dataListTypes, dataTypes } from "@/lib/util/getSubtitle"
import { ArrowLeft, ArrowRight, Copy, Eye, EyeOff } from "lucide-react"
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"
import { FixedSizeList } from "react-window"
import activeImage from "url:~assets/icons/active.gif"

import type { ModesTypes } from "./index"
import InputWord from "./InputWord"

interface ListenSubtitleCardProps {
  loading: boolean
  data: dataListTypes
  setData: (data: dataListTypes) => void
  isPlaying: boolean
  currentIndex: number
  handleVideoChange: (
    type: "playRate" | "currentTime" | "isPlaying",
    value: number | boolean
  ) => void
  modes: ModesTypes
}

const ListenSubtitleCard: React.FC<ListenSubtitleCardProps> = ({
  loading,
  data,
  isPlaying,
  currentIndex,
  handleVideoChange,
  setData,
  modes
}) => {
  // 添加新的状态控制是否允许自动滚动
  const [allowAutoScroll, setAllowAutoScroll] = useState(true)
  const [focusIndex, setFocusIndex] = useState(null)

  // 用于存储定时器ID
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const currentRowData: dataTypes = data[currentIndex]
  const totalLength = data.length
  const { listenWriteMode, noteMode } = modes
  // const currentRawArr = currentRowData?.translateContent ? currentRowData?.translateContent?.split(" ") : []
  const currentRawArr = currentRowData?.content
    ? currentRowData?.content?.split(" ")
    : []
    console.log(currentRowData)
  // 监听 Shift+ArrowLeft 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.code === "ArrowLeft") {
        e.preventDefault() // 阻止默认的 Shift+ArrowLeft 行为
        if (currentIndex > 0) {
          handleVideoChange("currentTime", currentIndex - 1)
        }
      }
      if (e.shiftKey && e.code === "ArrowRight") {
        e.preventDefault() // 阻止默认的 Shift+ArrowRight 行为
        if (currentIndex < totalLength - 1) {
          handleVideoChange("currentTime", currentIndex + 1)
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentIndex, handleVideoChange])
  const handleChange = (
    index: number,
    key: string,
    value: string | boolean
  ) => {
    const updateRow = {
      ...currentRowData,
      [key]: value
    }
    const updateData = [...data]
    updateData[index] = updateRow
    setData(updateData)
  }

  // 处理用户交互后的自动滚动恢复
  const handleUserInteraction = () => {
    setAllowAutoScroll(false)

    // 清除之前的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // 设置新的定时器，5秒后恢复自动滚动
    timerRef.current = setTimeout(() => {
      setAllowAutoScroll(true)
    }, 5000)
  }

  // 渲染每一行的组件
  const Row = ({ index, style }) => (
    <div
      style={style}
      className={`px-4 py-4 cursor-pointer hover:bg-primary/10 ${
        index === currentIndex ? "bg-primary/30" : ""
      }`}
      onClick={() => {
        handleUserInteraction()
        handleVideoChange("currentTime", index)
      }}>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">第 {index + 1} 句</span>
        {index === currentIndex && isPlaying ? (
          <img src={activeImage} alt="active indicator" className="w-4 h-4" />
        ) : index === currentIndex ? (
          <img
            className="w-4 h-4"
            src="data:image/png;base64,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"
          />
        ) : null}
      </div>
    </div>
  )

  return (
    <div className="h-full">
      {/* 左侧句子List */}
      <div className="absolute left-0 w-[200px] h-[calc(100%-80px-64px-64px)] border-r border-gray-200 bg-inherit py-2">
        {loading ? (
          // 加载中显示骨架屏
          <div className="space-y-4 p-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <FixedSizeList
            height={window.innerHeight - 80 - 64 - 64 - 80}
            width={200}
            itemCount={totalLength}
            itemSize={56}
            initialScrollOffset={currentIndex * 56}
            onScroll={handleUserInteraction}
            ref={(list) => {
              // 只在允许自动滚动时执行滚动逻辑
              if (list && allowAutoScroll) {
                const visibleHeight = window.innerHeight - 80 - 64 - 64 - 80
                const midPoint = visibleHeight / 2
                const itemPosition = currentIndex * 56

                if (itemPosition > midPoint) {
                  list.scrollToItem(currentIndex, "center")
                }
              }
            }}>
            {Row}
          </FixedSizeList>
        )}
      </div>
      {/* 右侧句子内容 */}
      <div className="flex justify-between items-center ml-[200px] px-12 h-full">
        <Button
          size="icon"
          className="rounded-full h-12 w-12 min-w-12"
          onClick={() => {
            if (currentIndex > 0) {
              handleVideoChange("currentTime", currentIndex - 1)
            }
          }}
          title="快捷键:Shift+左箭头⬅"
          disabled={currentIndex === 0}>
          <ArrowLeft />
        </Button>
        <div className="text-lg px-10 py-4 space-y-4 flex flex-col align-middle flex-grow h-full">
          <div className="text-center mb-4 text-gray-600">
            <span className="text-primary text-xl">{currentIndex + 1}</span> /{" "}
            {totalLength}
          </div>

          {/* 内容区域 */}
          <div className="flex flex-col items-center space-y-4">
            {/* 原文部分 */}
            <div className="">
              {/* 固定高度 */}
              <div
                className="pl-4"
                onClick={(e) => {
                  e.stopPropagation()
                  handleChange(
                    currentIndex,
                    "showRaw",
                    !currentRowData?.showRaw
                  )
                }}>
                <div className="min-h-[40px] flex cursor-pointer tems-center rounded-lg">
                  <span
                    className="text-base"
                    style={
                      currentRowData?.showRaw
                        ? {}
                        : {
                            color: "transparent",
                            textShadow: "#5a5656 0 0 11px"
                          }
                    }>
                    {currentRowData?.content || "暂无原文(该视频作者未上传原文字幕)"}
                  </span>
                </div>
              </div>
            </div>

            {/* 译文部分 */}
            <div className="">
              {/* 固定高度 */}
              <div
                className="pl-4"
                onClick={(e) => {
                  e.stopPropagation()
                  handleChange(
                    currentIndex,
                    "showTranslate",
                    !currentRowData?.showTranslate
                  )
                }}>
                <div
                  className={`min-h-[48px] flex items-center cursor-pointer rounded-lg ${
                    currentRowData?.showTranslate
                      ? ""
                      : "backdrop-blur-md bg-white/30"
                  }`}>
                  <span
                    className="text-base"
                    style={
                      currentRowData?.showTranslate
                        ? {}
                        : {
                            color: "transparent",
                            textShadow: "#5a5656 0 0 11px"
                          }
                    }>
                    {currentRowData?.translateContent || "暂无译文(该视频作者未上传译文字幕)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* 用户输入区域 */}
          {listenWriteMode ? (
            <div
              id="listenWriteContentDom"
              className={"flex flex-wrap gap-3  w-full"}>
              {/* {
                  currentRowData.
                } */}
              {currentRawArr.length ? (
                currentRawArr.map((item, index) => (
                  <InputWord
                    setFocusIndex={setFocusIndex}
                    focusIndex={focusIndex}
                    word={item}
                    key={`${item}-${index}`}
                    index={index}
                    totalLength={currentRawArr.length}
                    inputValueArr={
                      currentRowData?.listenWriteContent?.split(" ") || []
                    }
                    onChange={(value) =>
                      handleChange(
                        currentIndex,
                        "listenWriteContent",
                        value.join(" ")
                      )
                    }
                  />
                ))
              ) : (
                <div className="w-full flex justify-center">
                  <Input
                    className="w-[80%] min-h-[60px]"
                    // placeholder="请输入听到的内容..."
                    value={currentRowData?.listenWriteContent || ""}
                    onChange={(e) => {
                      // 阻止事件冒泡
                      e.stopPropagation()
                      handleChange(
                        currentIndex,
                        "listenWriteContent",
                        e.target.value
                      )
                    }}
                    // 添加 onKeyDown 事件处理器来阻止键盘事件冒泡
                    onKeyDown={(e) => {
                      e.stopPropagation()
                    }}
                  />
                  {/* <div className="w-[80%]">
                <Progress
                  inputValue={currentRowData?.listenWriteContent || ""}
                  targetValue={currentRowData?.content || ""}
                  height={4}
                />
              </div>  */}
                </div>
              )}
            </div>
          ) : null}
          {noteMode ? (
            <div className="w-full flex flex-col items-center">
              <Textarea
                className="w-[80%] min-h-[80px]"
                placeholder="笔记...(可导出笔记)"
                value={currentRowData?.noteContent || ""}
                onChange={(e) => {
                  e.stopPropagation()
                  handleChange(currentIndex, "noteContent", e.target.value)
                }}
                onKeyDown={(e) => {
                  e.stopPropagation()
                }}
              />
            </div>
          ) : null}
        </div>
        <Button
          size="icon"
          className="rounded-full h-12 w-12 min-w-12"
          onClick={() => {
            if (currentIndex < totalLength - 1) {
              handleVideoChange("currentTime", currentIndex + 1)
            }
          }}
          title="快捷键:Shift+右箭头➡"
          disabled={currentIndex === totalLength - 1}>
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

export default ListenSubtitleCard
function useEffectLayout(arg0: () => void) {
  throw new Error("Function not implemented.")
}
