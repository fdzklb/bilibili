import { exportWordDocx } from "@/lib/utils"
import Content from "./Content"
import Footer from "./Footer"
import Header, { type DownloadType } from "./Header"
import {
  fetchSubtitles,
  formatSubtitleData,
  getAidOrBvid,
  type dataListTypes
} from "@/lib/util/getSubtitle"
import React, {useEffect, useRef, useState } from "react"

export type ModesTypes = {
  listenWriteMode: boolean
  noteMode: boolean
  showRaw: boolean
  showTranslate: boolean
}

// 获取字幕数据的函数
const getSubtitle = async (location: Location) => {
  const aidOrBvid = await getAidOrBvid(location)
  const subtitles = await fetchSubtitles(aidOrBvid)
  return subtitles
}

type ListenSubtitleProps = {
  setShowCard: (showCard: boolean) => void
  showCard: boolean
}

// 主组件
const ListenSubtitle = ({ setShowCard, showCard }: ListenSubtitleProps) => {
  const [title, setTitle] = useState<string>("") //标题
  const [data, setData] = useState<dataListTypes>([]) //字幕数据
  const [loading, setLoading] = useState(true) //加载状态
  const [isRepeat, setIsRepeat] = useState(false) //是否开启循环播放
  const [currentIndex, setCurrentIndex] = useState(0) //当前前字幕索引
  const [isPlaying, setIsPlaying] = useState(false) //视频播放状态 暂停/播放
  // 视频播放进度条
  const [currentTime, setCurrentTime] = useState(0) //当前视频时间
  const [duration, setDuration] = useState(0) //视频总时长

  const videoRef = useRef<HTMLVideoElement>(null)

  // 头部操作按钮
  const [modes, setModes] = useState<ModesTypes>({
    listenWriteMode: true, // 是否开启听写模式
    noteMode: false, // 是否开启笔记模式
    showRaw: true, // 是否显示原文
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
  }, [data.length, modes.showRaw, modes.showTranslate])

  useEffect(() => {
    if (data.length === 0) return
    const video = document
      .querySelector(".bpx-player-video-wrap")
      ?.querySelector("video")
    videoRef.current = video
  }, [data.length])

  // 获取字幕数据
  useEffect(() => {
    const getSubtitles = async () => {
      setLoading(true)
      const data = await getSubtitle(location)
      const { title, author } = data
      const formatData: dataListTypes = formatSubtitleData(data, 6)
      setData(formatData)
      setLoading(false)
      setTitle(title)
    }
    getSubtitles()
  }, [])

  // 监听视频播放状态变化
  useEffect(() => {
    if (!videoRef.current || data.length === 0) return
    // 设置视频总时长
    setDuration(videoRef.current?.duration || 0)

    // 监听视频播放状态 暂停|播放
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    // 添加事件监听
    videoRef.current.addEventListener("play", handlePlay)
    videoRef.current.addEventListener("pause", handlePause)

    const handleTimeUpdate = () => {
      if (!isPlaying) return
      //如果正在播放
      const currentTime = videoRef.current.currentTime
      if (isRepeat) {
        // 如果开启了循环播放
        const currentSubtitle = data[currentIndex]
        if (currentTime > currentSubtitle.to - 0.1) {
          videoRef.current.currentTime = currentSubtitle.from
          setCurrentTime(videoRef.current.currentTime)
          return
        }
      } else {
        // 如果未开启循环播放
        const index = data.findIndex(
          (subtitle) =>
            subtitle.from <= currentTime && subtitle.to >= currentTime
        )
        if (index !== -1) {
          setCurrentIndex(index)
          setCurrentTime(currentTime)
        }
      }
    }
    videoRef.current.addEventListener("timeupdate", handleTimeUpdate)
    // 清理事件监听
    return () => {
      videoRef.current?.removeEventListener("play", handlePlay)
      videoRef.current?.removeEventListener("pause", handlePause)
      videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [videoRef.current, data.length, isPlaying, isRepeat, currentIndex])


  const handleVideoChange = (
    type: "playRate" | "currentTime" | "isPlaying",
    value: number | boolean
  ) => {
    if (videoRef.current) {
      if (type === "playRate") {
        videoRef.current.playbackRate = value as number
      } else if (type === "currentTime") {
        const currentTime = data[value as number].from + 0.05
        videoRef.current.currentTime = currentTime
        setCurrentIndex(value as number)
      } else if (type === "isPlaying") {
        if (value) {
          videoRef.current.play()
        } else {
          videoRef.current.pause()
        }
      }
    }
  }

  // 下载文档
  const handleDownload = (type: DownloadType, docType: string) => {
    exportWordDocx(
      chrome.runtime.getURL(`assets/template.docx`),
      {
        description: "欢迎使用bilibili插件，有任何问题可以联系我！",
        author: 'fangdada',
        email: '358646034@qq.com',
        title: title,
        data: data.map((item) => ({ content: item.content, translateContent: item.translateContent, noteContent: item.noteContent }))
      },
      `${title}.docx`
    )
    // if (docType === "DOC") {
    // }
  }

  return (
    showCard ? (
      <div className="fixed top-16 right-0 flex flex-col gap-2 w-[80vw] h-[calc(100vh-64px)] bg-[#FFFFF4] rounded-lg shadow-xl">
        {/* 头部操作区域 */}
        <Header
          modes={modes}
          setModes={setModes}
          setShowCard={setShowCard}
          handleDownload={handleDownload}
        />
      <div className="h-[calc(100%-80px-64px-64px)]">
        {/* 中间句子List和句子内容 */}
        <Content
          loading={loading}
          data={data}
          isPlaying={isPlaying}
          currentIndex={currentIndex}
          handleVideoChange={handleVideoChange}
          modes={modes}
          setData={setData}
        />
      </div>
      {/* 视频进度条控制区域 */}
      <div className="w-full h-[80px] px-8 py-2 backdrop-blur-sm border-t border-gray-200">
        <Footer
          currentIndex={currentIndex}
          dataLength={data.length}
          duration={duration}
          currentTime={currentTime}
          handleVideoChange={handleVideoChange}
          isPlaying={isPlaying}
          isRepeat={isRepeat}
          setIsRepeat={setIsRepeat}
        />
        </div>
      </div>
    ) : null
  )
}

export default ListenSubtitle

