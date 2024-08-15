import { Button, Input, Radio, Row, Space } from "antd/es"
import { useEffect, useRef, useState } from "react"

import "./style.css"
import { log } from "console"

function IndexSidePanel() {
  const [data, setData] = useState([])
  const [isCircle, setIsCircle] = useState(false)
  const [time, setTime] = useState("") // 0000 0023 0130 1023 表示间隔点为00:00 00:23 01:30 10:23
  const [currentIndex, setCurrentIndex] = useState(0)

  const vedioRef = useRef();

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.action === "previous") {
        if(currentIndex === 0) return;
        postTime(currentIndex-1)
      } else if (request.action === "next") {
        if(currentIndex === data.length - 1) return;
        postTime(currentIndex+1)
      } else if (request.action === "currentTime") {
        if(isCircle && data[currentIndex] - request.data < 0.2) {
          postTime(currentIndex)
        }
      }
    })
  }, [])

  const handleSubmit = () => {
    const timeArr = time.split(" ")
    setData(timeArr)
    chrome.runtime.sendMessage({ action: "getVedio" }, (response) => {
      console.log(response)
      // 在这里处理 DOM 元素数据
      vedioRef.current = response.domElement
      log(response, 'responsole');
    })
  }

  const postTime = (index) => {
    if(vedioRef.current) {
      setCurrentIndex(data[index])
      // 设置开始时间
      vedioRef.current.currentTime = formatTime(data[time]);
      // 开始播放
      vedioRef.current.play();
    }
  }

  const formatTime = (time) => {
    const second = +time.slice(-2);
    const min= +time.slice(0, -2);
    return min * 60 + second;
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
          onChange={() => setIsCircle(!isCircle)}
          value={isCircle}
          optionType="button"
          options={[
            { label: "是", value: true },
            { label: "否", value: false }
          ]}
        />
      </Row>
      <Row justify="start" gutter={8}>
        {data.map((time, index) => (
          <div className="mr-2" key={index}>
            <Button
              type={currentIndex === index ? "primary" : "default"}
              onClick={() => postTime(index)}>
              {`第${index + 1}段`}
            </Button>
          </div>
        ))}
      </Row>
    </Space>
  )
}

export default IndexSidePanel
