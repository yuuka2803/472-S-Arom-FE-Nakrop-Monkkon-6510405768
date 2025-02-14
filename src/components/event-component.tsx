'use client'

import { useState } from "react"
import { CalendarDays } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Event } from "../../type/types"

const colorMap: { [key: string]: { bg: string; text: string } } = {
  pink: { bg: "#F1BFB970", text: "#8B0000" },
  lightGreen: { bg: "#9ECDB070", text: "#006400" },
  yellow: { bg: "#F7CF5370", text: "#FFD700" },
  purple: { bg: "#6F429370", text: "#4B0082" },
  red: { bg: "#D75A4470", text: "#8B0000" },
  blue: { bg: "#6795D970", text: "#00008B" },
  orange: { bg: "#FAAA6370", text: "#FF4500" },
  green: { bg: "#385F3370", text: "#006400" },
  brown: { bg: "#9B826F70", text: "#8B4513" },
}

export function EventComponent({ event }: { event: Event }) {
  const [isOpen, setIsOpen] = useState(false)

  const bgColor = colorMap[event.color]?.bg || "#FFFFFF"
  const textColor = colorMap[event.color]?.text || "#000000"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className="h-full w-full rounded-md p-1 text-xs font-medium shadow-sm cursor-pointer flex items-center"
          style={{ backgroundColor: bgColor, color: textColor }}
          onClick={() => setIsOpen(true)}
        >
          <CalendarDays className="mr-1 h-3 w-3" />
          {event.title}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <span
                className="text-md font-medium"
                style={{ color: bgColor }}
              >
                Description:
              </span>
              <span className="col-span-3 text-md break-words">{event.description}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-md font-medium">Start Date:</span>
              <span className="col-span-3 text-md">
                {event.start.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-md font-medium">End Date:</span>
              <span className="col-span-3 text-md">
                {event.end.toLocaleString()}
              </span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}