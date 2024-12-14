import { calculateMatchDegree, type MatchResult } from "@/lib/utils"
import React, { useMemo } from "react"
import { Label } from "../ui"

interface ColorSegment {
  color: string
  percentage: number
}

interface ProgressProps {
  // 当前进度值 (0-100)
  inputValue: string
  // 目标值
  targetValue: string
  // 进度条高度
  height?: number
  // 是否显示百分比文字
  showPercentage?: boolean
  // 自定义类名
  className?: string
}

export const Progress: React.FC<ProgressProps> = ({
  inputValue,
  targetValue,
  height = 8,
  showPercentage = true,
  className = ""
}) => {
  

  const segments = useMemo(() => {
    return calculateMatchDegree(inputValue, targetValue)
  }, [inputValue, targetValue])

  // const segments = [
  //   { lengthRatio: 5, similarity: 1, toolTip: "tool1" },
  //   { lengthRatio: 20, similarity: 0, toolTip: "tool2" },
  //   { lengthRatio: 25, similarity: 2, toolTip: "tool3" },
  //   { lengthRatio: 25, similarity: -1, toolTip: "tool4" },
  //   { lengthRatio: 25, similarity: 0, toolTip: "tool5" },
  // ]

  const clampedValue = segments.reduce((acc, segment) => acc + (segment.similarity > 0 ? segment.lengthRatio : 0), 0)

  const colorMap = {
    '0': "#E74032",
    '1': "#FBC013",
    '2': "#26DB6F"
  }

  return (
    <div className={`relative w-full flex items-center gap-2 ${className}`}>
      {/* 进度条背景 */}
      <div
        className="w-full rounded-full bg-gray-200 overflow-hidden"
        style={{ height: `${height}px` }}>
        {/* 渲染多色进度段 */}
        <div className="h-full flex">
          {segments.map((segment, index) => (
            <div
              key={index}
              // title={`${segment.toolTip}`}
              className="h-full transition-all duration-300 cursor-pointer"
              style={{
                width: `${segment.lengthRatio}%`,
                backgroundColor: colorMap[segment.similarity.toString()],
                transform: `scaleX(1)`,
                transformOrigin: "left"
              }}
            />
          ))}
        </div>
      </div>

      {/* 百分比显示 */}
      {showPercentage && (
        <span className="text-sm ml-2 text-gray-600 min-w-[45px]">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  )
}
