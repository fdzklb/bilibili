import Content from "@/components/ListenSubtitle/Content"
import Footer from "@/components/ListenSubtitle/Footer"
import Header from "@/components/ListenSubtitle/Header"
import { fetchSubtitles, formatSubtitleData, getAidOrBvid, type dataListTypes } from "@/lib/util/getSubtitle"
import styleText from "data-text:@/global.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import React, { useCallback, useEffect, useState } from "react"
import "../global.css"

export type ModesTypes = {
  listenWriteMode: boolean
  noteMode: boolean
  showRaw: boolean
  showTranslate: boolean
}

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

// 获取字幕数据的函数
const getSubtitle = async (location: Location) => {
  const aidOrBvid = await getAidOrBvid(location)
  const subtitles = await fetchSubtitles(aidOrBvid)
  return subtitles
}

// 主组件
const BiliSubtitle = () => {
  const [data, setData] = useState<dataListTypes>([]) //字幕数据
  const [loading, setLoading] = useState(true) //加载状态
  const [isRepeat, setIsRepeat] = useState(false) //是否开启循环播放
  const [repeatCount, setRepeatCount] = useState(99999) //循环播放次数 默认5次
  const [currentRepeatCount, setCurrentRepeatCount] = useState(0) //当前循环播放次数
  const [currentIndex, setCurrentIndex] = useState(0) //当前前字幕索引
  const [isPlaying, setIsPlaying] = useState(false) //视频播放状态 暂停/播放
  // 视频播放进度条
  const [currentTime, setCurrentTime] = useState(0) //当前视频时间
  const [duration, setDuration] = useState(0) //视频总时长

  // 头部操作按钮
  const [modes, setModes] = useState<ModesTypes>({
    listenWriteMode: false, // 是否开启听写模式
    noteMode: false, // 是否开启笔记模式
    showRaw: false, // 是否显示原文
    showTranslate: false // 是否显示译文
  })

  // 当点击显示原文/译文按钮时
  useEffect(() => {
    const newData = data.map((item) => {
      return {
        ...item,
        showRaw: modes.showRaw,
        showTranslate: modes.showTranslate
      }
    })
    setData(newData)
  }, [modes.showRaw, modes.showTranslate])

  // 获取视频元素
  const getVideoElement = useCallback(() => {
    const videoWrap = document.querySelector(".bpx-player-video-wrap")
    return videoWrap?.querySelector("video")
  }, [data.length])

  // 获取字幕数据
  useEffect(() => {
    const getSubtitles = async () => {
      setLoading(true)
      const data = await getSubtitle(location)
      const formatData: dataListTypes = formatSubtitleData(data)
      setData(formatData)
      setLoading(false)
    }
    getSubtitles()
  }, [])

  // 监听视频播放状态变化
  useEffect(() => {
    const video = getVideoElement()
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    // 添加事件监听
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    // 初始化播放状态
    setIsPlaying(!video.paused)

    // 清理事件监听
    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [getVideoElement])

  // 设置播放速度
  const handleSpeedChange = useCallback((speed: string) => {
    const video = getVideoElement()
    if (video) {
      video.playbackRate = parseFloat(speed)
    }
  }, [])

  // 设置字幕索引，并更新视频进度条上当前时间
  const resetCurrentIndex = useCallback((index: number) => {
    const video = getVideoElement()
    if (video) {
      const currentTime = data[index].from
      video.currentTime = currentTime
    }
    setCurrentIndex(index)
  }, [])

  // 处理进度条拖动
  const handleSeek = useCallback((time: number) => {
    const video = getVideoElement()
    if (video) {
      video.currentTime = time
      // 根据新的时间位置更新当前字幕索引
      if (data.length > 0) {
        const newIndex = data.findIndex(
          (subtitle) => time >= subtitle.from && time <= subtitle.to
        )
        if (newIndex !== -1) {
          setCurrentIndex(newIndex)
        }
      }
    }
  }, [])

  // 处理循环播放
  const handleRepeatChange = useCallback((enabled: boolean, count: number) => {
    setIsRepeat(enabled)
    setRepeatCount(count)
    setCurrentRepeatCount(0)
  }, [])

  // 监听网页上视频时间进度，同步更新当前时间进度
  useEffect(() => {
    const video = getVideoElement()
    if (!video) return
    let lastCheck = 0
    const CHECK_INTERVAL = 100 // 每100ms更新一次时间进度，避免频繁触发
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime
      const now = Date.now()
      if (now - lastCheck < CHECK_INTERVAL) return
      lastCheck = now
      setCurrentTime(currentTime)
      setDuration(video.duration)
    }
    video.addEventListener("timeupdate", handleTimeUpdate)
    return () => video.removeEventListener("timeupdate", handleTimeUpdate)
  }, [])

  // 监听视频播放/暂停状态
  useEffect(() => {
    const video = getVideoElement()
    if (!video) return
    const handlePlay = () => {
      setIsPlaying(true)
    }
    const handlePause = () => {
      setIsPlaying(false)
    }
    // 添加播放和暂停事件监听
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    // 初始化播放状态
    setIsPlaying(!video.paused)
    // 清理事件监听
    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [getVideoElement])

  // 根据isPlaying状态控制视频播放/暂停
  useEffect(() => {
    const video = getVideoElement()
    if (!video) return
    if (isPlaying) {
      video.play()
    } else {
      video.pause()
    }
  }, [isPlaying])

  // 处理循环播放
  useEffect(() => {
    const video = getVideoElement()
    if (!video) return

    // 如果字幕数据为空，则不进行任何操作
    if (!data.length) return
    // 如果未开启循环播放，
    if (!isRepeat) {
      // 遍历字幕数组找到当前时间对应的字幕索引
      const newIndex = data.findIndex(
        (subtitle) => currentTime >= subtitle.from && currentTime <= subtitle.to
      )
      // 如果找到对应字幕且索引不同,则更新currentIndex
      if (newIndex !== -1 && newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    } else {
      // 如果开启循环播放
      const currentSubtitle = data[currentIndex]
      // 如果超出当前字幕时间范围
      if (currentTime > currentSubtitle.to) {
        if (currentRepeatCount < repeatCount - 1) {
          // 还没达到重复次数,跳回字幕开始处
          resetCurrentIndex(currentIndex)
          setCurrentRepeatCount((prev) => prev + 1)
        } else {
          // 达到重复次数,重置计数并进入下一句
          setCurrentRepeatCount(0)
          // 检查是否是最后一句字幕
          if (currentIndex === data.length - 1) {
            setIsPlaying(false) // 如果是最后一句则暂停视频
          } else {
            // 不是最后一句,则跳到下一句
            setCurrentIndex((prev) => prev + 1)
          }
        }
      }
    }
  }, [
    currentTime,
    isRepeat,
    repeatCount,
    currentRepeatCount,
    data.length,
    currentIndex
  ])

  return (
    <div className="fixed top-16 right-0 flex flex-col gap-2 w-[80vw] h-[80vh] bg-[#FFFFF5] rounded-lg shadow-xl">
      {/* 头部操作区域 */}
      <Header
        onSpeedChange={handleSpeedChange}
        onRepeatChange={handleRepeatChange}
        repeatCount={repeatCount}
        modes={modes}
        setModes={setModes}
      />
      <div className="h-[calc(100%-160px)]">
        {/* 中间句子List和句子内容 */}
        <Content
          loading={loading}
          data={data}
          isPlaying={isPlaying}
          currentIndex={currentIndex}
          resetCurrentIndex={resetCurrentIndex}
          modes={modes}
          setData={setData}
        />
      </div>
      {/* 视频进度条控制区域 */}
      <div className="w-full h-[80px] px-8 py-2 backdrop-blur-sm border-t border-gray-200">
        <Footer
          duration={duration}
          currentTime={currentTime}
          onSeek={handleSeek}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
          repeatCount={repeatCount}
          isRepeat={isRepeat}
          handleRepeatChange={handleRepeatChange}
          handleSpeedChange={handleSpeedChange}
        />
      </div>
    </div>
  )
}

export default BiliSubtitle
