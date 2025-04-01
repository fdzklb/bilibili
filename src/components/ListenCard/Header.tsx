import {
  Button,
  Label,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui"
import { cn } from "@/lib/utils"
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
  Minimize2,
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
import type { ModesTypes } from "./index"

interface HeaderProps {
  modes: ModesTypes
  setModes: (modes: ModesTypes) => void
  setShowCard: (showCard: boolean) => void
  handleDownload: (type: DownloadType, docType: string) => void
}

export type DownloadType = "raw" | "translate" | "raw+translate" | "raw+note" | "translate+note" | "raw+translate+note"

const Header: React.FC<HeaderProps> = ({ modes, setModes, setShowCard, handleDownload }) => {

  return (
    <div className="backdrop-blur-sm shadow-sm p-4 border-b border-gray-200">
      <div className="flex items-center justify-between gap-4">
        {/* 中间控制组 */}
        <div className="flex items-center gap-4"></div>

        {/* 侧控制组 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 pr-6">
            {[
              { value: "showRaw", title: "原文" },
              { value: "showTranslate", title: "译文" },
              { value: "listenWriteMode", title: "听写模式" },
              { value: "noteMode", title: "笔记模式" }
            ].map((mode, index) => (
              <div
                key={mode.value}
                className={cn(
                  "flex items-center gap-2",
                  index === 1 && "border-r border-gray-200 pr-6"
                )}>
                <label
                  htmlFor={mode.value}
                  className="text-sm font-medium text-gray-700">
                  {mode.title}
                </label>
                <Switch
                  id={mode.value}
                  checked={modes[mode.value]}
                  onCheckedChange={() =>
                    setModes({ ...modes, [mode.value]: !modes[mode.value] })
                  }
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => handleDownload("raw+translate+note", 'doc')}
            className="h-6">
            <span>下载(word格式)</span>
            <Download className="h-4 w-4" />
          </Button>
          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="h-6">
                <span>下载(word格式)</span>
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{ zIndex: 2147483647 }}>
              {[
                { title: "原文", value: "raw" },
                { title: "译文", value: "translate" },
                { title: "原文+译文", value: "raw+translate" },
                { title: "原文+笔记", value: "raw+note" },
                { title: "原文+译文+笔记", value: "raw+translate+note" }
              ].map((item) => (
                <DropdownMenuItem
                  onClick={() => handleDownload(item.value as DownloadType, 'doc')}>
                  {item.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => setShowCard(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/80 cursor-pointer"
                  title="收起">
                  <Minimize2 className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="end"
                sideOffset={5}
                style={{ zIndex: 2147483647 }}>
                收起
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

export default Header
