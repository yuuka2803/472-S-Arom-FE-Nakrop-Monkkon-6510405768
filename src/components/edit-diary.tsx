"use client";
import { useState, useEffect, use } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoAddOutline } from "react-icons/io5";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MoodCard } from "./mood-card";
import { Diary, UpdateDiary } from "@/interface/Diary";
import useUpdateDiaries from "@/api/diary/useUpdate";
import { jwtDecode } from "jwt-decode";
import useUserIdDiary from "@/api/diary/useUserIdDiary";
import { image } from "@heroui/theme";

interface EditDiaryProps {
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

export default function EditDiary({ date }: EditDiaryProps) {
  const [isHasToken, setIsHasToken] = useState(false);
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsHasToken(true);
      setUserData(jwtDecode(token));
    } else {
      setIsHasToken(false);
    }
  }, [setIsHasToken]);
  const { data: diaries, isLoading, error } = useUserIdDiary(userData?.user_id);
  const data = diaries?.find((item) => item.date === `${date}T00:00:00Z`);
  const router = useRouter();
  const updateDiary = useUpdateDiaries();
  const [emotions, setEmotions] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [imagesDiary, setImagesDiary] = useState<File[]>([]);
  const [imagesDiaryURL, setImagesDiaryURL] = useState<string[]>([]);
  const [diary, setDiary] = useState<Diary>();
  const [moodImage, setMoodImage] = useState<string>("");
  useEffect(() => {
    if (data) {
      setMoodImage(moodImages[data.mood]);
      setEmotions(data.emotions);
      setDescription(data.description);
      setMood(data.mood);
      setImagesDiaryURL(data.images);
      setDiary(data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const onUpdate = async () => {
    const new_diary: UpdateDiary = {
      date: date,
      mood: mood,
      emotions: emotions,
      description: description,
      user_id: userData?.user_id,
      images_url: imagesDiaryURL,
      images: imagesDiary,
    };
    try {
      await updateDiary.mutateAsync({ date: date, diary: new_diary });
      router.push("/diary/display");
    } catch (err) {
      console.error("Failed to update diary entry:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-3 gap-4">
        <button
          className="bg-[#F4ECE5] rounded-md flex justify-center items-center gap-7 px-5"
          onClick={() => {
            const navigateTo = `/diary?edit=true`;
            router.push(navigateTo);
          }}
        >
          <img
            src={moodImage}
            alt="mood"
            width={130}
            height={100}
            className="object-cover"
          />
          <p className="text-2xl font-semibold">{mood}</p>
        </button>
        <div className="bg-[#F4ECE5] col-span-2 px-5 py-3 h-full flex flex-col">
          <p className="text-3xl font-medium">Emotions</p>
          <MoodCard setEmotions={setEmotions} emotions={emotions} />
        </div>
      </div>
      <div className="bg-[#F4ECE5] p-10 flex gap-4">
        {imagesDiaryURL?.map((img, index) => (
          <div key={img} className="relative">
            <button
              className="absolute top-0 right-0 bg-white rounded-full p-1"
              onClick={() => {
                setImagesDiaryURL(imagesDiaryURL.filter((_, i) => i !== index));
              }}
            >
              <RxCross2 className=" text-red-600  text-xl" />
            </button>
            <img
              key={index}
              src={img}
              alt="image"
              className="object-cover rounded-md mr-2"
              style={{ width: 140, height: 200 }}
            />
          </div>
        ))}

        {imagesDiary?.map((img, index) => (
          <div key={img.name} className="relative">
            <button
              className="absolute top-0 right-0 bg-white rounded-full p-1"
              onClick={() => {
                setImagesDiary(imagesDiary.filter((_, i) => i !== index));
              }}
            >
              <RxCross2 className=" text-red-600  text-xl" />
            </button>
            <img
              key={index}
              src={URL.createObjectURL(img)}
              alt="image"
              className="object-cover rounded-md mr-2"
              style={{ width: 140, height: 200 }}
            />
          </div>
        ))}

        <Button
          className="flex  shadow-lg py-2 bg-[#D9CEC5] hover:bg-[#bcafa3] rounded-xl  relative overflow-visible p-2 items-center justify-center "
          style={{ width: 140, height: 200 }}
          onClick={() => {
            document.getElementById("images")?.click();
          }}
        >
          <IoAddOutline className=" text-gray-600  text-7xl" />
          <input
            hidden
            id="images"
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={(e) => {
              const selectedFiles = e.target.files;
              if (selectedFiles) {
                setImagesDiary([...imagesDiary, ...Array.from(selectedFiles)]);
              }
            }}
          />
        </Button>
      </div>
      <div className="bg-[#F4ECE5] p-10">
        <p className="text-4xl font-medium">Tell me about your day?</p>
        <textarea
          autoFocus
          defaultValue={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px] w-full border-none bg-[#F4ECE5] py-1 text-base placeholder:text-muted-foreground focus-visible:outline-none rounded-md mt-4"
          placeholder="Type your message here."
        ></textarea>
      </div>
      <Button
        className="w-full bg-[#F4ECE5] text-arom_brown border border-arom_brown mt-4"
        onClick={onUpdate}
      >
        <p className="text-2xl font-semibold">Update</p>
      </Button>
    </div>
  );
}
