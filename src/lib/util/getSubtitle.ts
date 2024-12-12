
// 从页面获取视频信息
export async function getAidOrBvid(location: Location): Promise<string | null> {
    try {
      const pathSearchs: Record<string, string> = {}
      location.search
        .slice(1)
        .replace(/([^=&]*)=([^=&]*)/g, (matchs, a, b, c) => (pathSearchs[a] = b))
      let aidOrBvid = pathSearchs.bvid
      if (!aidOrBvid) {
        let path = location.pathname
        if (path.endsWith("/")) {
          path = path.slice(0, -1)
        }
        const paths = path.split("/")
        aidOrBvid = paths[paths.length - 1]
      }
      return aidOrBvid
    } catch (err) {
      console.error("Failed to get video info:", err)
      return null
    }
  }
  
  // 获取字幕数据
  export async function fetchSubtitles(aidOrBvid: string) {
    try {
      let aid, cid, subtitles, pages, ctime, author, title
      if (aidOrBvid.toLowerCase().startsWith("av")) {
        //av
        aid = parseInt(aidOrBvid.slice(2))
        pages = await fetch(
          `https://api.bilibili.com/x/player/pagelist?aid=${aid}`,
          { credentials: "include" }
        )
          .then((res) => res.json())
          .then((res) => res.data)
        cid = pages[0].cid
        ctime = pages[0].ctime
        author = pages[0].owner?.name
        title = pages[0].part
        await fetch(
          `https://api.bilibili.com/x/player/wbi/v2?aid=${aid}&cid=${cid}`,
          { credentials: "include" }
        )
          .then((res) => res.json())
          .then((res) => {
            subtitles = res.data.subtitle.subtitles
          })
      } else {
        //bvid
        await fetch(
          `https://api.bilibili.com/x/web-interface/view?bvid=${aidOrBvid}`,
          { credentials: "include" }
        )
          .then((res) => res.json())
          .then(async (res) => {
            title = res.data.title
            aid = res.data.aid
            cid = res.data.cid
            ctime = res.data.ctime
            author = res.data.owner?.name
            pages = res.data.pages
          })
        await fetch(
          `https://api.bilibili.com/x/player/wbi/v2?aid=${aid}&cid=${cid}`,
          { credentials: "include" }
        )
          .then((res) => res.json())
          .then((res) => {
            subtitles = res.data.subtitle.subtitles
          })
      }
      const all_subtitles = []
      if (subtitles.length > 0) {
        const fetchs = subtitles.map(async (info) => {
          const url = info.subtitle_url.startsWith("//")
            ? info.subtitle_url.replace("//", "https://")
            : info.subtitle_url.startsWith("http://")
              ? info.subtitle_url.replace("http://", "https://")
              : info.subtitle_url
          return fetch(url).then((res) => res.json())
        })
        const result = await Promise.allSettled(fetchs)
        result.forEach((item) => {
          if (item.status === 'fulfilled') {
            all_subtitles.push(item.value)
          }
        })
      }  
      return {
        all_subtitles,
        author,
        title
      }
    } catch (err) {
      console.error("Failed to fetch subtitles:", err)
      return null
    }
  }

  export type rawDataTypes = {
    all_subtitles: {
      body: { from: number; to: number; sid: number; content: string }[]
    }[]
    author: string
    title: string
  }

  export type dataTypes = {
    from: number;
    to: number;
    sid: number;
    content: string;
    showRaw: boolean;
    showTranslate: boolean;
    // listenWriteMode: boolean;
    // noteMode: boolean;
    listenWriteContent: string;
    noteContent: string;
    translateContent: string;
  }
  export type dataListTypes = dataTypes[]
  // 格式化字幕数据
  export function formatSubtitleData(data: rawDataTypes) : dataListTypes {
    const { all_subtitles = [], author, title } = data
    const [arr1, arr2] = all_subtitles
    const translateArr = arr2?.body || []
    const rawArr = (arr1?.body || []).map((item, index) => {
      return {  
        ...item,
        // listenWriteMode: false,
        // noteMode: false,
        showRaw: false, // 是否显示原文
        showTranslate: false, // 是否显示译文
        listenWriteContent: '',
        noteContent: '',
        translateContent: translateArr[index]?.content || ''
      }
    })
    return rawArr
  }