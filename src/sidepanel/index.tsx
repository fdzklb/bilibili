import type {
    PlasmoCSConfig,
    PlasmoCSUIJSXContainer,
    PlasmoRender,
    PlasmoGetStyle,
    PlasmoGetOverlayAnchor
  } from "plasmo"
  import React, { useEffect, useState } from "react"
  
  import ListenSubtitleCard from "@/components/ListenCard"
  import { fetchSubtitles, getAidOrBvid } from "@/lib/util/getSubtitle"
  import "../global.css"
  import { Button } from "@/components/ui"
  
  
  // 获取字幕数据的函数
  const getSubtitle = async (location: Location) => {
    const aidOrBvid = await getAidOrBvid(location)
    const subtitles = await fetchSubtitles(aidOrBvid)
    return subtitles
  }
  
  // 主组件
  const BiliSubtitle = () => {
    const [data, setData] = useState<any>({})
    const [loading, setLoading] = useState(true)
  
    // useEffect(() => {
    //   const getSubtitles = async () => {
    //     setLoading(true)
    //     const data = await getSubtitle(location)
    //     setData(data)
    //     setLoading(false)
    //   }
    //   getSubtitles()
    // }, [])
  
    return (
      
        <div className="fixed top-16 right-0 hw-top">
          {/* <ListenSubtitleCard loading={loading} data={data} /> */}
          <Button>1233</Button>
        </div>
    )
  }
  
  
  export default BiliSubtitle
  