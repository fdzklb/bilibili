import React from "react"

interface ColorSegment {
  color: string
  percentage: number
}

interface ProgressProps {
  // 当前进度值 (0-100)
  value: number
  // 颜色段配置数组
  segments?: ColorSegment[]
  // 进度条高度
  height?: number
  // 是否显示百分比文字
  showPercentage?: boolean
  // 自定义类名
  className?: string
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  segments = [{ color: "#33CC33", percentage: 100 }], // 默认使用单一蓝色
  height = 8,
  showPercentage = true,
  className = ""
}) => {
  // 确保value在0-100之间
  const clampedValue = Math.min(100, Math.max(0, value))

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
              className="h-full transition-all duration-300"
              style={{
                width: `${segment.percentage}%`,
                backgroundColor: segment.color,
                transform: `scaleX(${clampedValue >= segment.percentage ? 1 : clampedValue / segment.percentage})`,
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
