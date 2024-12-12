import React, { useEffect, useRef, useState } from 'react'
import { Slider } from '@/components/ui'
import { formatTime } from '@/lib/utils'

interface VideoProgressProps {
  duration: number // 视频总时长(秒)
  currentTime: number // 当前播放时间(秒)
  onSeek: (time: number) => void // 拖动进度条时的回调函数
}

export default function VideoProgress({ duration, currentTime, onSeek }: VideoProgressProps) {
  // 将当前进度转换为百分比
  const progress = (currentTime / duration) * 100

  // 处理进度条拖动
  const handleSliderChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration
    onSeek(newTime)
  }

  return (
    <div className="space-y-2 flex-1">
      {/* 进度条 */}
      <Slider
        value={[progress]}
        max={100}
        step={0.1}
        onValueChange={handleSliderChange}
        className="cursor-pointer"
      />
    </div>
  )
}
