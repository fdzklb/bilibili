import {
  Button,
  Label,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui"
import {
  DropdownMenu,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Download,
  PauseCircle,
  Repeat,
  Settings
} from "lucide-react"
import React, { useEffect, useState } from "react"

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "../ui/dropdown-menu"
import type { ModesTypes } from "@/contents/bilibili-subtitle"

interface HeaderProps {
  onSpeedChange: (speed: string) => void
  onRepeatChange: (enabled: boolean, count: number) => void
  repeatCount: number
  modes: ModesTypes
  setModes: (modes: ModesTypes) => void
}

const Header: React.FC<HeaderProps> = ({
  onSpeedChange,
  onRepeatChange,
  repeatCount,
  modes,
  setModes
}) => {
  return (
    <div className="backdrop-blur-sm shadow-sm p-4 border-b border-gray-200">
      <div className="flex items-center justify-between gap-4">
        {/* 中间控制组 */}
        <div className="flex items-center gap-4"></div>

        {/* 侧控制组 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            {[
              { value: "showRaw", title: "原文" },
              { value: "showTranslate", title: "译文" },
              { value: "listenWriteMode", title: "听写模式" },
              { value: "noteMode", title: "笔记模式" }
            ].map((mode) => (
              <div key={mode.value} className="flex items-center gap-2">
                <label
                  htmlFor={mode.value}
                  className="text-sm font-medium text-gray-700">
                  {mode.title}
                </label>
                <Switch
                  id={mode.value}
                  checked={modes[mode.value]}
                  onCheckedChange={() => setModes({ ...modes, [mode.value]: !modes[mode.value] })}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            ))}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="hover:bg-gray-200/50 p-2 rounded cursor-pointer">
                  <div className="flex items-center">
                    <Label className="text-gray-700">快捷键</Label>
                    <Settings className="h-4 w-4 pl-1 text-gray-700" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="end"
                sideOffset={5}
                style={{ zIndex: 2147483647 }}>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 px-1 py-0.5">
                    <ArrowLeft className="h-4 w-4" /> 上一句
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" /> 下一句
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4" /> 隐藏/显示原文
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4" /> 隐藏/显示译文
                  </div>
                  <div className="flex items-center gap-2">
                    shift 开启/取消循环播放
                  </div>
                  <div className="flex items-center gap-2">
                    space(空格) 播放/暂停
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
              <Download className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{ zIndex: 2147483647 }}>
              {["原文", "译文", "原文+译文", "原文+译文+笔记"].map((type) => (
                <DropdownMenuSub key={type}>
                  <DropdownMenuSubTrigger>{type}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {["PDF", "DOC", "SRT"].map((format) => (
                      <DropdownMenuItem key={format}>{format}</DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default Header
