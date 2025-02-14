import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { Divider } from "@nextui-org/divider";
import MoodCardDisplay from "./mood-card-display";
import { jwtDecode } from "jwt-decode";
import useUserIdDiary from "@/api/diary/useUserIdDiary";

interface DisplayDiaryProps {
  date: string;
}

const moodImages: { [key: string]: string } = {
  Angry: require("@/app/img/Angry.png"),
  Anxious: require("@/app/img/Anxious.png"),
  Happy: require("@/app/img/Happy.png"),
  InLove: require("@/app/img/InLove.png"),
  Sad: require("@/app/img/Sad.png"),
  Silly: require("@/app/img/Silly.png"),
  SoSo: require("@/app/img/SoSo.png"),
};

export default function DisplayDiary({ date }: DisplayDiaryProps) {
  const [isHasToken, setIsHasToken] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const router = useRouter();

  // Get token and decode user data
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsHasToken(true);
      setUserData(jwtDecode(token));
    } else {
      setIsHasToken(false);
    }
  }, []);

  // Fetch diary data by user ID
  const { data: diaries, isLoading, error } = useUserIdDiary(userData?.user_id);
  console.log("Diary:",diaries);

  const data = diaries?.find((item) => item.date === `${date}T00:00:00Z`)
console.log("Data:",data , "Date:",date);
  // Set emotions whenever data changes
  useEffect(() => {
    if (data?.emotions) {
      setSelectedEmotions(data.emotions);
    }
  }, [data?.emotions]);

  const moodImage = data?.mood ? moodImages[data.mood] : "";

  if (isLoading) {
    return <div>Loading...</div>;
  }

 if (!data) {
    return (
      <>
        <Divider className="w-full " />
        <div className="w-full text-gray-500 text-center">
          ไม่มีการบันทึกไดอารี่ในวันที่กำหนด
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#F4ECE5] rounded-md flex justify-center items-center gap-6 px-5">
          <Image src={moodImage} alt="mood" width={130} height={100} />
          <p className="text-2xl font-semibold p-5">{data?.mood}</p>
        </div>
        <div className="bg-[#F4ECE5] col-span-2 px-5 py-3 h-full flex flex-col">
          <p className="text-3xl font-medium">Emotions</p>
          <MoodCardDisplay selectedEmotions={selectedEmotions} />
        </div>
      </div>
      <div className="bg-[#F4ECE5] p-10">
        <p className="text-4xl font-medium">Tell me about your day?</p>
        <p className="min-h-[200px] w-full border-none bg-[#F4ECE5] py-1 text-base placeholder:text-muted-foreground focus-visible:outline-none rounded-md mt-4">
          {data?.description}
        </p>
      </div>
      {date === new Date().toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" }).split(" ")[0] && (
        <Button
          className="w-full bg-[#F4ECE5] text-arom_brown border border-arom_brown mt-4"
          onClick={() => {
            router.push(`/diary/create`);
          }}
        >
          <p className="text-2xl font-semibold">Edit</p>
        </Button>
      )}
    </div>
  );
}
