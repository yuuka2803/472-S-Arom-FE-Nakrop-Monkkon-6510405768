'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import useUserIdDiary from "@/api/diary/useUserIdDiary";

export default function Diary() {
    const [isHasToken, setIsHasToken] = useState(false);
    const [userData, setUserData] = useState<any>()
  
    useEffect(() => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        setIsHasToken(true);
        setUserData(jwtDecode(token))
      } else {
        setIsHasToken(false);
      }
    }, [setIsHasToken]);

    const [date, setDate] = useState<Date>(new Date());
    const searchParams = useSearchParams();
    const checkEdit = searchParams.get("edit");
    const formattedDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(date).replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
    const router = useRouter();
    const { data:diary, isLoading, error } = useUserIdDiary(userData?.user_id);
    if (isLoading) {
        return <div>Loading...</div>;
      }
    if (diary?.find((item) => item.date === `${formattedDate}T00:00:00Z` && checkEdit !== "true")){
        router.push(`/diary/display`)
    }
    else{
        router.push(`/diary/mood`)
    }
    
}