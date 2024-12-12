import React from "react"
import "../global.css"
import { Button } from "@/components/ui/button"

function IndexPopup() {
  return (
      <Button>
        <div className="p-4 flex justify-center w-60">
          <div>
            b站视频片段重复播放，可用于英语预料反复精听、乐器视频反复观看等
          </div>
        </div>
      </Button>
  )
}

export default IndexPopup
