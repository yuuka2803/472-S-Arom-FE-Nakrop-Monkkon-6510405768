"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { jwtDecode } from "jwt-decode";
import Image, { StaticImageData } from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";
import useUserIdDiary from "@/api/diary/useUserIdDiary";

// Importing mood images
import Happy from "@/app/img/Happy.png";
import SoSo from "@/app/img/SoSo.png";
import InLove from "@/app/img/InLove.png";
import Sad from "@/app/img/Sad.png";
import Silly from "@/app/img/Silly.png";
import Anxious from "@/app/img/Anxious.png";
import Angry from "@/app/img/Angry.png";
import useUserIdTask from "@/api/event/useUserIdTask";

// Type definitions
interface CalendarItem {
  id: string;  
  type: "event" | "diary";
  title?: string;
  start: Date;
  end: Date;
}

interface Task extends CalendarItem {
  description: string;
  complete: boolean;
  tag: string;
  user_id: string;
}

interface Diary extends CalendarItem {
  mood: "Happy" | "SoSo" | "InLove" | "Sad" | "Silly" | "Anxious" | "Angry";
  date: Date;
  emotions: string[];
  description: string;
  user_id: string;
}

const moodImages: { [key in Diary["mood"]]: StaticImageData } = {
  Happy: Happy,
  SoSo: SoSo,
  InLove: InLove,
  Sad: Sad,
  Silly: Silly,
  Anxious: Anxious,
  Angry: Angry,
};

const localizer = momentLocalizer(moment);

const TodoComponent = ({ task }: { task: Task }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className={`h-full w-full rounded-md p-1 text-xs font-medium shadow-sm cursor-pointer flex items-center ${
            task.complete
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-800"
          }`}
          onClick={() => setIsOpen(true)}
        >
          {task.complete ? (
            <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
          ) : (
            <Circle className="mr-1 h-3 w-3" aria-hidden="true" />
          )}
          <span className="truncate">{task.title}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="text-[18px] font-medium">Description:</span>
              <span className="col-span-3 text-[18px] break-words">
                {task.description}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-[18px] font-medium">Due Date:</span>
              <span className="col-span-3 text-[18px]">
                {task.end.toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-[18px] font-medium">Status:</span>
              <span
                className={`col-span-3 text-[18px] font-medium ${
                  task.complete ? "text-green-600" : "text-yellow-600"
                } capitalize`}
              >
                {task.complete ? "Completed" : "Incomplete"}
              </span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="text-[18px] font-medium">Tag:</span>
              <Badge
                className={
                  task.complete
                    ? "bg-green-100 text-green-800 text-base w-fit"
                    : "bg-yellow-100 text-yellow-800 text-base w-fit"
                }
              >
                {task.tag}
              </Badge>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const DiaryComponent = ({ diary }: { diary: Diary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const imageSrc = moodImages[diary.mood] || "/img/default.png";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Image
          src={imageSrc}
          width={80}
          height={80}
          alt={`Mood: ${diary.mood}`}
          className="cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Your Mood on {diary.date.toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="text-[18px] font-medium">Mood:</span>
              <span className="col-span-3 text-[18px] font-medium capitalize">
                {diary.mood}
              </span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="text-[18px] font-medium">Description:</span>
              <span className="col-span-3 text-[18px] break-words">
                {diary.description}
              </span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="text-[18px] font-medium">Emotions:</span>
              <div className="col-span-3 flex flex-wrap gap-2">
                {diary.emotions.map((emotion, index) => (
                  <Badge
                    key={index}
                    className="bg-yellow-500 hover:bg-yellow-400 text-base"
                  >
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const CalendarItemWrapper = ({ event }: { event: CalendarItem }) => {
  if (!event) return null;

  return event.type === "event" ? (
    <TodoComponent task={event as Task} />
  ) : event.type === "diary" ? (
    <DiaryComponent diary={event as Diary} />
  ) : null;
};

const formatItems = (
  items: (CalendarItem | Diary | Task)[]
): CalendarItem[] => {
  return items.map((item) => {
    if (item.type === "event") {
      return {
        ...item,
        title: (item as Task).title || "No Title",
        start: new Date(item.start),
        end: new Date(item.end),
      } as CalendarItem;
    } else if (item.type === "diary") {
      return {
        ...item,
        start: new Date(item.start),
        end: new Date(item.end),
      } as CalendarItem;
    }
    return item as CalendarItem;
  });
};

export default function CalendarPage() {
  const [userData, setUserData] = useState<any>();
  const [view, setView] = useState<(typeof Views)[keyof typeof Views]>(
    Views.MONTH
  );
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState<(Diary | Task)[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserData(decodedToken);
    }
  }, []);

  const {
    data: diaries,
    isLoading: diaryLoading,
    error,
  } = useUserIdDiary(userData?.user_id);

  const {
    data: tasks,
    isLoading: taskLoading,
    error: taskError,
  } = useUserIdTask(userData?.user_id)

  useEffect(() => {
    if (!diaryLoading && diaries) {
      console.log(diaries);
    }
    if (!taskLoading && tasks) {
      console.log(tasks);
    }
  }, [diaryLoading, diaries, taskLoading, tasks]);

  console.log(userData);

  useEffect(() => {
    const mockItems: (Diary | Task)[] = [];
  
    if (diaries) {
      diaries.forEach((item) => {
        mockItems.push({
          ...item,
          id: item.id,
          date: new Date(item.date),
          mood: item.mood as "Happy" | "SoSo" | "InLove" | "Sad" | "Silly" | "Anxious" | "Angry",
          emotions: item.emotions,
          description: item.description,
          type: "diary",
          user_id: item.user_id,
          start: new Date(item.date),
          end: new Date(item.date),
        });
      });
    }
    
    if (tasks) {
      tasks.forEach((item) => {
        mockItems.push({
          ...item,
          id: item.id,
          title: item.title,
          description: item.description,
          complete: item.complete,
          
          start: new Date(item.start),
          end: new Date(item.end),
          tag: item.tag,
          type: "event",
          user_id: item.user_id,
        })
      })
    }
  
    setItems(mockItems);
  }, [userData, diaries]);
  

  

  

  const allItems = formatItems(items);

  return (
    <div className="h-[800px] w-full p-4 font-sans">
      <style jsx global>{`
        .rbc-calendar {
          background-color: #fffcf9;
          border-radius: 0.5rem;
          box-shadow: 0 7px 10px 0 rgba(0, 0, 0, 0.1),
            0 3px 5px 0 rgba(0, 0, 0, 0.06);
        }
        .rbc-header {
          background-color: #f3f4f6;
          padding: 0.5rem;
          font-weight: 600;
        }

        .rbc-button-link {
          color: #9b826f;
        }
        .rbc-today {
          background-color: #f7cf5350;
        }
        .rbc-event {
          background-color: transparent;
        }
        .rbc-event-content {
          font-size: 0.75rem;
        }
        .rbc-toolbar button {
          color: #4b5563;
          border-radius: 0.35rem;
        }
        .rbc-toolbar button:hover {
          background-color: #6795d950;
        }
        .rbc-toolbar button.rbc-active {
          background-color: #6795d980;
          color: white;
        }
        @media (max-width: 640px) {
          .rbc-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .rbc-toolbar-label {
            margin: 0.5rem 0;
          }
        }
      `}</style>
      <Calendar
        localizer={localizer}
        events={allItems}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        components={{ event: CalendarItemWrapper }}
        views={[Views.MONTH, Views.WEEK]}
        defaultView={Views.MONTH}
        view={view}
        date={date}
        onView={(newView) => setView(newView)}
        onNavigate={setDate}
        toolbar={true}
      />
    </div>
  );
}
