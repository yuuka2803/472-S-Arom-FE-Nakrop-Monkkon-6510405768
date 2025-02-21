"use client";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@nextui-org/button";
import DisplaDiary from "@/components/display-diary";
import CreateDiary from "@/components/create-diary";
import useDateDiary from "@/api/diary/useDateDiary";
import EditDiary from "@/components/edit-diary";

export default function DiaryPage() {
  const [mood, setMood] = useState<string>("");
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const moodParam = searchParams.get("mood");
    if (moodParam) setMood(moodParam);
  }, []);
  const [date, setDate] = useState<Date>(new Date()); //input date

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(date);
  const options = { timeZone: "Asia/Bangkok" };
  const year = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-GB", {
    month: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(date);
  const day = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(date);

  const formattedDateParse = `${year}-${month}-${day}`;
  return (
    <div className="flex flex-col gap-4 w-full px-10 py-5">
      <div className="flex w-fit">
        <p className=" text-5xl font-semibold "> {formattedDate} </p>
      </div>
      <EditDiary date={formattedDateParse} />
    </div>
  );
}
