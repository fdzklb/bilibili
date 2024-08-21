// import { Button, Input, Radio, Row, Space, message } from "antd/es"
// import { useEffect, useState } from "react"
// import "./style.css"
// function IndexSidePanel() {
//   const [data, setData] = useState([])
//   const [isCircle, setIsCircle] = useState(true)
//   const [time, setTime] = useState("") // 0000 0023 0130 1023 表示间隔点为00:00 00:23 01:30 10:23
//   const [currentIndex, setCurrentIndex] = useState(-1)


//   useEffect(() => {
//     const len = data.length
//     chrome.runtime.onMessage.addListener(
//       function (request, sender, sendResponse) {
//         if (len === 0) return
//         if (request.action === "previous") {
//           if (currentIndex === 0) return
//           setCurrentIndex(currentIndex - 1)
//         } else if (request.action === "next") {
//           if (currentIndex === len - 1) return
//           setCurrentIndex(currentIndex + 1)
//         }
//       }
//     )
//   }, [data.length, currentIndex])

//   useEffect(() => {
//     if(data.length > 0) {
//       chrome.runtime.sendMessage({
//         action: "resetCurrentTime",
//         currentTime: formatTime(data[currentIndex]),
//         endTime: formatTime(data[currentIndex + 1])
//       })
//     }
//   }, [currentIndex, data])

//   const handleSubmit = () => {
//     const timeArr = time.split(" ")
//     if (timeArr.length < 2) {
//       message.error("请输入至少两个时间节点")
//       return
//     }
//     setData(timeArr)
//     setCurrentIndex(0)
//   }

//   const formatTime = (time) => {
//     const second = +time.slice(-2)
//     const min = +time.slice(0, -2)
//     return min * 60 + second
//   }

//   const onChangeCircle = () => {
//     setIsCircle(!isCircle)
//     chrome.runtime.sendMessage(
//       { action: "changeCircle", isCircle: !isCircle },
//     )
//   }

//   return (
//     <Space direction="vertical" size={24} className="w-full text-sm p-6">
//       <div>输入时间节点将视频切片（用一个空格分隔的数字, 后两位表示秒，前几位表示分钟，如：000 100 1000表示分隔成0:00到1:00、1:00到10:00这两段，快捷键：Shift+Left 上一片段，Shift+Right：下一片段）</div>
//       <Row justify="start" wrap={false}>
//         <Input.TextArea
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           allowClear
//         />
//         <Button onClick={handleSubmit} type="primary" className="ml-4">
//           确定
//         </Button>
//       </Row>
//       <Row justify="start" align="middle">
//         <span className="pr-2">是否循环播放: </span>
//         <Radio.Group
//           onChange={onChangeCircle}
//           value={isCircle}
//           optionType="button"
//           options={[
//             { label: "是", value: true },
//             { label: "否", value: false }
//           ]}
//         />
//       </Row>
//       <Row justify="start">
//         {data.slice(0, data.length - 1).map((time, index) => (
//           <div className="mr-2 mb-2" key={index}>
//             <Button
//               type={currentIndex === index ? "primary" : "default"}
//               onClick={() => setCurrentIndex(index)}>
//               {`第${index + 1}段`}
//             </Button>
//           </div>
//         ))}
//       </Row>
//     </Space>
//   )
// }

// export default IndexSidePanel
