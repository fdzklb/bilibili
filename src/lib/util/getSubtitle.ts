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
        if (item.status === "fulfilled") {
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
  from: number
  to: number
  sid: number
  content: string
  showRaw?: boolean
  showTranslate?: boolean
  // listenWriteMode: boolean;
  // noteMode: boolean;
  listenWriteContent?: string
  noteContent?: string
  translateContent?: string
}
export type dataListTypes = dataTypes[]
// 格式化字幕数据
export function formatSubtitleData(
  data: rawDataTypes,
  timePerid: number = 8
): dataListTypes {
  const { all_subtitles = [] } = data
  const [arr1, arr2] = all_subtitles

  let isChineseOfArr1 = isChinese(
    arr1?.body?.slice(0, 3).map((item) => item.content) || []
  )
  let isChineseOfArr2 = isChinese(
    arr2?.body?.slice(0, 3).map((item) => item.content) || []
  )
  const translateArr = isChineseOfArr1
    ? arr1?.body
    : isChineseOfArr2
      ? arr2?.body
      : []
  const rawArr = !isChineseOfArr1
    ? arr1?.body
    : !isChineseOfArr2
      ? arr2?.body
      : []
  const newTranslateArr = translateArr.map((item) => ({
    sid: item.sid,
    from: item.from,
    to: item.to,
    translateContent: item.content
  }))
  const merge = mergeArr(rawArr || [], newTranslateArr || [], timePerid)
  return merge
}

const mergeArr = (
  rawArr: dataListTypes,
  translateArr: Omit<dataTypes, "content">[],
  timePerid: number = 7
) => {
  // 合并字幕片段 使合并后的片段时长在3-timePerid秒之间, 避免一句太短或者太长
  // 但是如果下一个而片段出现1秒以上间隔，则很有可能下一个片段是新的一句话，则不再合并下一段
  const mergedArr: dataTypes[] = []
  let currentSegment: dataTypes | null = null
  const isTranslate = (rawArr.length === 0 && translateArr.length > 0)
  const realMergeArr = isTranslate ? translateArr : rawArr
  for (let i = 0; i < realMergeArr.length; i++) {
    const current = {
      content: '',
      translateContent: '',
      showRaw: false,
      showTranslate: false,
      listenWriteContent: "",
      noteContent: "",
      ...realMergeArr[i],
    }

    // 如果没有当前片段，将当前字幕作为新片段
    if (!currentSegment) {
      currentSegment = { ...current }
      continue
    }

    const timeDiff = current.from - currentSegment.to
    const segmentDuration = currentSegment.to - currentSegment.from

    // 如果时间间隔超过1秒或当前片段时长已超过timePerid秒，保存当前片段并开始新片段
    if (timeDiff > 1 || segmentDuration > timePerid) {
      mergedArr.push(currentSegment)
      currentSegment = { ...current }
      continue
    }

    // 如果当前片段时长小于timePerid秒且时间间隔小于1秒，合并片段
    if (segmentDuration < timePerid) {
      currentSegment = {
        ...currentSegment,
        to: current.to,
        content: `${currentSegment.content} ${current.content}`.trim(),
        translateContent: `${currentSegment.translateContent} ${current.translateContent}`.trim(),
      }
      continue
    }
    // 当前片段时长在3-timePerid秒之间，保存当前片段并开始新片段
    mergedArr.push(currentSegment)
    currentSegment = { ...current }
  }

  // 添加最后一个片段
  if (currentSegment) {
    mergedArr.push(currentSegment)
  }
  if (translateArr.length === 0 || mergedArr[0]?.translateContent.trim() !== "")
    return mergedArr
  // 将合并后的片段与翻译片段合并，如果翻译片段的to和合并后的片段的to相差不过1秒
  // 则将翻译片段的content合并到合并后的片段的content中
  const newArr = []
  let k = 0
  for (let i = 0; i < mergedArr.length; i++) {
    const current = mergedArr[i]
    for (let j = k; j < translateArr.length; j++) {
      const next = translateArr[j]
      if (next && next.to - current.to < 1) {
        current.translateContent = `${current.translateContent}${next.translateContent}`
      } else {
        k = j
        break
      }
    }
    newArr.push(current)
  }
  return newArr
}

//判断是否是中文，一个字符串有超过一半是中文则返回true
// 多条字符串有一半以上符合条件则返回true

export function isChinese(strArr: string[]) {
  let chineseStrCount = 0
  for (let i = 0; i < strArr.length; i++) {
    // 只保留str中中文和英语字母
    let str = strArr[i].replace(/[^a-zA-Z\u4e00-\u9fa5]/g, "")
    let count = 0
    for (let j = 0; j < str.length; j++) {
      if (/[\u4e00-\u9fa5]/.test(str[j])) {
        count++
        if (count > str.length / 2) {
          chineseStrCount++
          if (chineseStrCount > strArr.length / 2) {
            return true
          }
        }
      }
    }
  }
  return false
}
