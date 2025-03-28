import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { Divider } from "@heroui/divider";
import MoodCardDisplay from "./mood-card-display";
import { jwtDecode } from "jwt-decode";
import useUserIdDiary from "@/api/diary/useUserIdDiary";
import AngryImg from "@/app/img/Angry.png";
import AnxiousImg from "@/app/img/Anxious.png";
import HappyImg from "@/app/img/Happy.png";
import InLoveImg from "@/app/img/InLove.png";
import SadImg from "@/app/img/Sad.png";
import SillyImg from "@/app/img/Silly.png";
import SoSoImg from "@/app/img/SoSo.png";

interface DisplayDiaryProps {
  date: string;
}

const moodImages: { [key: string]: any } = {
  Angry: AngryImg,
  Anxious: AnxiousImg,
  Happy: HappyImg,
  InLove: InLoveImg,
  Sad: SadImg,
  Silly: SillyImg,
  SoSo: SoSoImg,
};

export default function DisplayDiary({ date }: DisplayDiaryProps) {
  const [isHasToken, setIsHasToken] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsHasToken(true);
      setUserData(jwtDecode(token));
    } else {
      setIsHasToken(false);
    }
  }, []);

  const { data: diaries, isLoading, error } = useUserIdDiary(userData?.user_id);
  const data = diaries?.find((item) => item.date === `${date}T00:00:00Z`);

  useEffect(() => {
    if (data?.emotions) {
      setSelectedEmotions(data.emotions);
    }
  }, [data?.emotions]);

  const moodImage = data?.mood ? moodImages[data.mood] : null;

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
          {moodImage && (
            <img
              src={moodImage.src.toString()}
              alt="mood"
              width={130}
              height={100}
              className="object-cover"
            />
          )}

          <p className="text-2xl font-semibold p-5">{data?.mood}</p>
        </div>
        <div className="bg-[#F4ECE5] col-span-2 px-5 py-3 h-full flex flex-col">
          <p className="text-3xl font-medium">Emotions</p>
          <MoodCardDisplay selectedEmotions={selectedEmotions} />
        </div>
      </div>
      <div className="bg-[#F4ECE5] p-10 flex gap-4">
        {data?.images?.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt={`image-${index}`}
              className="object-cover rounded-md mr-2"
              style={{ width: 140, height: 200 }}
            />
          </div>
        ))}
      </div>
      <div className="bg-[#F4ECE5] p-10">
        <p className="text-4xl font-medium">Tell me about your day?</p>
        <p className="min-h-[200px] w-full border-none bg-[#F4ECE5] py-1 text-base placeholder:text-muted-foreground focus-visible:outline-none rounded-md mt-4">
          {data?.description}
        </p>
      </div>
      {date ===
        new Date()
          .toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" })
          .split(" ")[0] && (
        <Button
          className="w-full bg-[#F4ECE5] text-arom_brown border border-arom_brown mt-4"
          onClick={() => {
            router.push(`/diary/edit`);
          }}
        >
          <p className="text-2xl font-semibold">Edit</p>
        </Button>
      )}
    </div>
  );
}
