import React, { useEffect, useState, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { FolderUp } from "lucide-react"

interface InputWordProps {
  word: string
  inputValueArr: string[]
  totalLength: number
  index: number
  focusIndex: number
  onChange?: (value: string[]) => void
  setFocusIndex: (index: number) => void
}

const InputWord: React.FC<InputWordProps> = ({ word, onChange, totalLength, inputValueArr, focusIndex, index, setFocusIndex }) => {
  const [matchPercentage, setMatchPercentage] = useState(0)
  const [hasError, setHasError] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  // 使用正则匹配去掉空格、以及字母左右除‘的其他任何符号
  const value = inputValueArr[index] || ""

  useEffect(() => {
    if (focusIndex === index) {
      console.log("foucsIndex === index", focusIndex, index)
      inputRef.current.focus()
    }  
  }, [focusIndex, index])

  // 监听Space按键事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        e.stopPropagation()
        if (index < totalLength) {
          setFocusIndex(index + 1)
        }
      }
      if (e.code === "ArrowLeft") {
        e.stopPropagation()
        // 如果光标的selectionStart为0，则将光标移到上一个input的末尾
        if (inputRef.current?.selectionStart === 0 && index > 0) {
          setFocusIndex(index - 1)
        }
      }
      if (e.code === "ArrowRight") {
        e.stopPropagation()
        // 如果光标的在文字末尾，则将光标移到下一个input的的开头
        if (inputRef.current?.selectionStart === inputRef.current?.value.length && index < totalLength) {
          e.preventDefault()
          e.stopPropagation()
          setFocusIndex(index + 1)
        }
      }
    }
    if(index === focusIndex) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown) 
    }
  }, [inputValueArr.length, index, focusIndex])

  useEffect(() => {
    const { percentage, hasError } = calculateMatch(value)
    setMatchPercentage(percentage)
    setHasError(hasError)
  }, [word, value])
  // 计算匹配度和错误状态
  const calculateMatch = (input: string) => {
    let matchCount = 0
    let hasError = false
    // 去掉空格、以及字母左右的任何符号
    const formatWord = word.replace(/[^\w']/g, "")
    if (input.length > formatWord.length) {
      hasError = true
      return { percentage: 0, hasError }
    }
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== formatWord[i]) {
        hasError = true
        break
      }
      matchCount++
    }
    const percentage = (matchCount / formatWord.length) * 100
    return { percentage, hasError }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const value = e.target.value
    const newArr = [...inputValueArr]
    newArr[index] = value
    onChange?.(newArr)
  }

  return (
    <div className="flex flex-col">
      <input
        style={{
          width: word?.length < 2 ? "40px" : word?.length * 20 + "px",
          textAlign: "center" // 添加文本居中对齐
        }}
        value={value}
        onFocus={(e) => setFocusIndex(index)}
        ref={inputRef}
        className="outline-none border-none shadow-none focus:outline-none focus:ring-0 focus:border-transparent hover:border-transparent"
        onChange={handleInputChange}
      />
      <Progress value={matchPercentage} className={`h-[2px] ${hasError ? "bg-red-500" : "bg-gray-500"}`} />
    </div>
  )
}

export default InputWord
