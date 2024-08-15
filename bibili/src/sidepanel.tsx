import { Button, Input, Radio, Row, Space } from "antd/es"
import { useEffect, useState } from "react"

import "./style.css"

import { log } from "console"

function IndexSidePanel() {
  const [data, setData] = useState([])
  const [isCircle, setIsCircle] = useState(false)
  const [time, setTime] = useState("") // 0000 0023 0130 1023 表示间隔点为00:00 00:23 01:30 10:23
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        if (request.action === "previous") {
          log("previous")
          if (currentIndex === 0) return
          sendResponse({
            currentTime: postTime(currentIndex - 1),
            endTime: data[currentIndex]
          })
        } else if (request.action === "next") {
          log("next")
          if (currentIndex === data.length - 1) return
          sendResponse({
            currentTime: postTime(currentIndex + 1),
            endTime: data[currentIndex + 2]
          })
        }
      }
    )
  }, [])

  const handleSubmit = () => {
    const timeArr = time.split(" ")
    setData(timeArr)
  }

  const postTime = (index) => {
    return formatTime(data[index])
  }

  const formatTime = (time) => {
    console.log("time", time)
    const second = +time.slice(-2)
    const min = +time.slice(0, -2)
    return min * 60 + second
  }

  const onChangeCircle = () => {
    setIsCircle(!isCircle)
    const tab = chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs) => {
        const activeTab = tabs[0]
        if (activeTab) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "changeCircle", isCircle: !isCircle },
            (response) => {
              console.log("Background/script received response:", response)
            }
          )
        }
      }
    )
    // chrome.runtime.sendMessage({ action: "changeCircle", isCircle: !isCircle })
  }

  const resetCurrentTime = (index) => {
    setCurrentIndex(index)
    const tab = chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs) => {
        const activeTab = tabs[0]
        if (activeTab) {
          chrome.tabs.sendMessage(
            activeTab.id,
            {
              action: "resetCurrentTime",
              currentTime: formatTime(data[index]),
              endTime: formatTime(data[index + 1])
            },
            (response) => {
              console.log("Background/script received response:", response)
            }
          )
        }
      }
    )
    chrome.runtime.sendMessage({
      action: "resetCurrentTime",
      currentTime: formatTime(data[index]),
      endTime: formatTime(data[index + 1])
    })
  }

  return (
    <Space direction="vertical" size={24} className="w-full text-sm p-6">
      <div>输入时间节点将视频切片（用空格分隔）</div>
      <Row justify="start" wrap={false}>
        <Input.TextArea
          value={time}
          onChange={(e) => setTime(e.target.value)}
          allowClear
        />
        <Button onClick={handleSubmit} type="primary" className="ml-4">
          确定
        </Button>
      </Row>
      <Row justify="start" align="middle">
        <span className="pr-2">是否循环播放: </span>
        <Radio.Group
          onChange={onChangeCircle}
          value={isCircle}
          optionType="button"
          options={[
            { label: "是", value: true },
            { label: "否", value: false }
          ]}
        />
      </Row>
      <Row justify="start" gutter={8}>
        {data.slice(0, data.length - 1).map((time, index) => (
          <div className="mr-2" key={index}>
            <Button
              type={currentIndex === index ? "primary" : "default"}
              onClick={() => resetCurrentTime(index)}>
              {`第${index + 1}段`}
            </Button>
          </div>
        ))}
      </Row>
    </Space>
  )
}

export default IndexSidePanel
