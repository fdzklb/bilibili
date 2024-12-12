import { Button, Textarea } from "@/components/ui"
import type { ModesTypes } from "@/contents/bilibili-subtitle"
import type { dataListTypes, dataTypes } from "@/lib/util/getSubtitle"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight, Eye } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import { FixedSizeList } from "react-window"
import activeImage from "url:~assets/icons/active.gif"

import { Progress } from "./Progress"

interface ListenSubtitleCardProps {
  loading: boolean
  data: dataListTypes
  setData: (data: dataListTypes) => void
  isPlaying: boolean
  currentIndex: number
  modes: ModesTypes
  resetCurrentIndex: (index: number) => void
}

const ListenSubtitleCard: React.FC<ListenSubtitleCardProps> = ({
  loading,
  data,
  isPlaying,
  currentIndex,
  resetCurrentIndex,
  setData,
  modes
}) => {
  const currentRowData: dataTypes = data[currentIndex]
  const totalLength = data.length

  const { listenWriteMode, noteMode } = modes

  useEffect(() => {
    console.log(modes)
  }, [modes])

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

  // 渲染每一行的组件
  const Row = ({ index, style }) => (
    <div
      style={style}
      className={`px-4 py-4 cursor-pointer hover:bg-gray-100 ${
        index === currentIndex ? "bg-blue-100" : ""
      }`}
      onClick={() => resetCurrentIndex(index)}>
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
    <div>
      {/* 左侧句子List */}
      <div className="absolute left-0 w-[200px] h-[calc(100%-180px)] border-r border-gray-200 bg-inherit py-2">
        <FixedSizeList
          height={window.innerHeight * 0.8 - 180}
          width={200}
          itemCount={totalLength}
          itemSize={56}
          initialScrollOffset={currentIndex * 56} // 初始滚动位置
          ref={(list) => {
            // 当currentIndex改变时,滚动到对应位置
            if (list) {
              // 获取可视区域的高度
              const visibleHeight = window.innerHeight * 0.8 - 180
              // 计算中点位置
              const midPoint = visibleHeight / 2
              // 计算当前项的位置
              const itemPosition = currentIndex * 56

              // 如果当前项在中点以下,则滚动到中间
              if (itemPosition > midPoint) {
                list.scrollToItem(currentIndex, "center")
              }
            }
          }}>
          {Row}
        </FixedSizeList>
      </div>
      {/* 右侧句子内容 */}
      <div className="flex justify-between items-center ml-[200px] px-12">
        <Button
          size="icon"
          className="rounded-full h-12 w-12"
          onClick={() => {
            if (currentIndex > 0) {
              resetCurrentIndex(currentIndex - 1)
            }
          }}
          disabled={currentIndex === 0}>
          <ArrowLeft />
        </Button>
        {/* 进度显示 */}
        <div className="text-lg px-10 py-4 space-y-4 flex flex-col items-center">
          <div className="text-center mb-4 text-gray-600">
            <span className="text-blue-500 text-2xl">{currentIndex + 1}</span> /{" "}
            {totalLength}
          </div>

          {/* 内容区域 */}
          <div className="flex flex-col items-center space-y-4">
            {/* 原文部分 */}
            <div className="h-12">
              {" "}
              {/* 固定高度 */}
              <div className="pl-4">
                {currentRowData?.showRaw ? (
                  <div className="min-h-[48px] flex items-center">
                    <span>{currentRowData.content || "暂无原文"}</span>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => {
                      handleChange(currentIndex, "showRaw", true)
                    }}>
                    <div className="px-4 flex items-center gap-1">
                      <Eye />
                      点击显示原文
                    </div>
                  </Button>
                )}
              </div>
            </div>

            {/* 译文部分 */}
            <div className="h-12">
              {" "}
              {/* 固定高度 */}
              <div className="pl-4">
                {currentRowData?.showTranslate ? (
                  <div className="min-h-[48px] flex items-center">
                    <span>{currentRowData?.translateContent || "暂无译文"}</span>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => {
                      handleChange(currentIndex, "showTranslate", true)
                    }}>
                    <div className="px-4 flex items-center gap-1">
                      <Eye />
                      点击显示译文
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </div>
          {/* 用户输入区域 */}
          <div className="space-y-6">
            {/* 固定高度 */}
            {listenWriteMode ? (
              <div
                className={cn(
                  "flex items-center gap-4",
                  noteMode ? "flex-row" : "flex-col"
                )}>
                <div>
                  <Textarea
                    className="w-96 h-[40px]"
                    placeholder="请输入听到的内容..."
                    value={currentRowData?.listenWriteContent || ""}
                    onChange={(e) =>
                      handleChange(
                        currentIndex,
                        "listenWriteContent",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div
                  className={cn(noteMode ? "w-[200px] " : "w-[400px]")}>
                  <Progress value={50} />
                </div>
              </div>
            ) : null}
            {noteMode ? (
              <div>
                <Textarea
                  className="w-[400px] min-h-[100px]"
                  placeholder="请输入笔记内容..."
                  value={currentRowData?.noteContent || ""}
                  onChange={(e) =>
                    handleChange(currentIndex, "noteContent", e.target.value)
                  }
                />
              </div>
            ) : null}
          </div>
        </div>
        <Button
          size="icon"
          className="rounded-full h-12 w-12"
          onClick={() => {
            if (currentIndex < totalLength - 1) {
              resetCurrentIndex(currentIndex + 1)
            }
          }}
          disabled={currentIndex === totalLength - 1}>
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

export default ListenSubtitleCard
