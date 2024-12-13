import { formatTime } from "@/lib/utils"
import {
  ListVideo,
  Pause,
  Play,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward
} from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

import {
  RadioGroup,
  RadioGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../ui"
import VideoProgress from "./VideoProgress"

interface VideoProgressProps {
  currentIndex: number
  duration: number // 视频总时长(秒)
  currentTime: number // 当前播放时间(秒)
  isPlaying: boolean
  repeatCount: number
  dataLength: number
  handleVideoChange: (type: 'playRate' | 'currentTime' | 'isPlaying', value: number | boolean) => void
  handleRepeatChange: (isRepeat: boolean, value: number) => void
  isRepeat: boolean
}

export default function Footer({
  duration,
  currentTime,
  isRepeat,
  isPlaying,
  currentIndex,
  dataLength,
  handleRepeatChange,
  handleVideoChange
}: VideoProgressProps) {

  const [playSpeed, setPlaySpeed] = useState("1")

  const handleRepeat = () => {
    if (isRepeat) {
      handleRepeatChange(!isRepeat, 0)
    } else {
      handleRepeatChange(!isRepeat, 9999)
    }
  }

  const handleSpeed = (value: string) => {
    setPlaySpeed(value)
    handleVideoChange('playRate', parseFloat(value))
  }


  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="flex items-center gap-4 w-full">
        <VideoProgress
          duration={duration}
          currentTime={currentTime}
          onSeek={(time) => handleVideoChange('currentTime', time)}
        />
        <div className="flex items-center gap-3">
          {/* 时间显示 */}
          <span className="text-sm text-green-700">{formatTime(currentTime)}</span>
          <span>/</span>
          <span className="text-sm">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-500 w-full">
        <div>
          <div className="flex items-center gap-3">
            {/* 无限循环按钮 */}
            <button
              onClick={handleRepeat}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isRepeat ? (
                      <Repeat1 className={"w-5 h-5 hover:text-[#33CC33] text-gray-600"} />
                    ) : (
                      <ListVideo className={"w-5 h-5 hover:text-[#33CC33] text-gray-600"} />
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" style={{ zIndex: 2147483647 }}>
                    切换播放模式
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
            {/* 上一段按钮 */}
            <button
              onClick={() => currentIndex > 0 && handleVideoChange('currentTime', currentIndex - 1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <SkipBack
                className="text-gray-600 hover:text-[#33CC33]"
                size={20}
                strokeWidth={2.5}
              />
            </button>

            {/* 播放/暂停按钮 */}
            <button
              onClick={() => handleVideoChange('isPlaying', !isPlaying)}
              className="p-2 rounded-full hover:bg-gray-100">
              {isPlaying ? (
                <Pause
                  className="text-gray-600 hover:text-[#33CC33]"
                  size={20}
                  strokeWidth={2.5}
                />
              ) : (
                <Play
                  className="text-gray-600 hover:text-[#33CC33]"
                  size={20}
                  strokeWidth={2.5}
                />
              )}
            </button>

            {/* 下一段按钮 */}
            <button
              onClick={() => currentIndex < dataLength - 1 && handleVideoChange('currentTime', currentIndex + 1)}
              className="p-2 rounded-full hover:bg-gray-100">
              <SkipForward
                className="text-gray-800 hover:text-[#33CC33]"
                size={20}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
        {/* 播放速度选择 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">倍速:</span>
          <RadioGroup
            className="flex items-center gap-2"
            value={playSpeed}
            onValueChange={handleSpeed}>
            {[0.75, 1, 1.5, 1.75, 2].map((speed) => (
              <div key={speed} className="flex items-center">
                <RadioGroupItem
                  value={speed.toString()}
                  id={`speed-${speed}`}
                  className="peer"
                />
                <label
                  htmlFor={`speed-${speed}`}
                  className="pl-2 text-sm font-medium text-gray-700 peer-data-[state=checked]:text-primary">
                  {speed}x
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
