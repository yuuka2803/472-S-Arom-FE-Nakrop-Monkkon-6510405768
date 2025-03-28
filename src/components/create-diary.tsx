"use client";
import useCreateDiary from "@/api/diary/useCreateDiary";
import { useState, useEffect, use } from "react";
import useDateDiary from "@/api/diary/useDateDiary";
import { Button } from "@nextui-org/button";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MoodCard } from "./mood-card";
import { CreateDiary as CreateType } from "@/interface/Diary";
import useUpdateDiaries from "@/api/diary/useUpdate";
import { jwtDecode } from "jwt-decode";
import useUserIdDiary from "@/api/diary/useUserIdDiary";

interface CreateDiaryProps {
  mood: string;
  date: string;
}

const moodImages: { [key: string]: string } = {
  Angry: require("@/app/img/Angry.png"),
  Anxious: require("@/app/img/Anxious.png"),
  Happy: require("@/app/img/Happy.png"),
  InLove: require("@/app/img/inLove.png"),
  Sad: require("@/app/img/Sad.png"),
  Silly: require("@/app/img/Silly.png"),
  SoSo: require("@/app/img/SoSo.png"),
};

export default function CreateDiary({ date, mood }: CreateDiaryProps) {
  const [isHasToken, setIsHasToken] = useState(false);
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsHasToken(true);
      setUserData(jwtDecode(token));
      console.log(token);
      console.log(userData);
    } else {
      setIsHasToken(false);
    }
  }, [setIsHasToken]);
  const { data: diaries, isLoading, error } = useUserIdDiary(userData?.user_id);
  console.log("Diary:", diaries);

  console.log("ThaiDate:", date);
  const data = diaries?.find((item) => item.date === `${date}T00:00:00Z`);
  const router = useRouter();
  const createDiary = useCreateDiary();
  const updateDiary = useUpdateDiaries();

  const [typeFunc, setTypeFunc] = useState<boolean>(false);

  const [emotions, setEmotions] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [moodSet, setMoodSet] = useState<string>(mood);
  const [diary, setDiary] = useState<CreateType>({
    date: date,
    mood: mood,
    emotions: [],
    description: "",
    user_id: "",
  });
  const [moodImage, setMoodImage] = useState<string>(moodImages[mood]);

  useEffect(() => {
    if (data) {
      console.log("Data:", data);
      setTypeFunc(true);
      setMoodImage(moodImages[data.mood]);
      setEmotions(data.emotions);
      setDescription(data.description);
      setMoodSet(data.mood);
      setDiary(data);
    }
  }, [data]);

  // Update mood image and mood set when mood prop changes
  useEffect(() => {
    if (mood !== "") {
      setMoodImage(moodImages[mood]);
      setMoodSet(mood);
    }
  }, [mood]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const onSubmit = async () => {
    const new_diary = {
      date: date,
      mood: moodSet,
      emotions: emotions,
      description: description,
      user_id: userData?.user_id,
    };
    try {
      console.log(new_diary);
      await createDiary.mutateAsync(new_diary);

      router.push("/diary/display");
      console.log(new_diary);
    } catch (err) {
      console.error("Failed to create diary entry:", err);
    }
  };

  const onUpdate = async () => {
    const new_diary = {
      date: date,
      mood: moodSet,
      emotions: emotions,
      description: description,
      user_id: userData?.user_id,
    };

    try {
      console.log(new_diary);
      await updateDiary.mutateAsync({ date: date, diary: new_diary });
      router.push("/diary/display");
      console.log(new_diary);
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
            console.log(navigateTo);
            router.push(navigateTo);
          }}
        >
          <Image src={moodImage} alt="mood" width={130} height={100} />
          <p className="text-2xl font-semibold">{moodSet}</p>
        </button>
        <div className="bg-[#F4ECE5] col-span-2 px-5 py-3 h-full flex flex-col">
          <p className="text-3xl font-medium">Emotions</p>
          <MoodCard setEmotions={setEmotions} emotions={emotions} />
        </div>
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
      {typeFunc ? (
        <Button
          className="w-full bg-[#F4ECE5] text-arom_brown border border-arom_brown mt-4"
          onClick={onUpdate}
        >
          <p className="text-2xl font-semibold">Update</p>
        </Button>
      ) : (
        <Button
          className="w-full bg-[#F4ECE5] text-arom_brown border border-arom_brown mt-4"
          onClick={onSubmit}
        >
          <p className="text-2xl font-semibold">Save</p>
        </Button>
      )}
    </div>
  );
}
