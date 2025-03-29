"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { jwtDecode } from "jwt-decode";
import useUserIdDiary from "@/api/diary/useUserIdDiary";

export default function Diary() {
  const [isHasToken, setIsHasToken] = useState(false);
  const [userData, setUserData] = useState<any>();
  const [date, setDate] = useState<Date>(new Date());
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsHasToken(true);
      setUserData(jwtDecode(token));
    } else {
      setIsHasToken(false);
    }
  }, [setIsHasToken]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiaryPageContent userData={userData} date={date} router={router} />
    </Suspense>
  );
}

const DiaryPageContent = ({ userData, date, router }: any) => {
  const searchParams = useSearchParams();
  const checkEdit = searchParams.get("edit");

  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3");

  const { data: diary, isLoading, error } = useUserIdDiary(userData?.user_id);

  useEffect(() => {
    if (isLoading) return;
    if (
      diary?.find(
        (item) =>
          item.date === `${formattedDate}T00:00:00Z` && checkEdit !== "true",
      )
    ) {
      router.push(`/diary/display`);
    } else {
      router.push(`/diary/mood`);
    }
  }, [isLoading, diary, formattedDate, checkEdit, router]);

  if (isLoading || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>Diary Page</div>
    </div>
  );
};
