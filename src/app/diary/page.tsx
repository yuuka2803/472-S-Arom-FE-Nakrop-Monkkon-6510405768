'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { CoolMode } from "@/components/ui/cool-mode";
import EmotionButton from "@/components/emotion-Button";
import howareu from '@/app/img/howareyou.png'
import Happy from '@/app/img/Happy.png'
import SoSo from '@/app/img/SoSo.png'
import InLove from '@/app/img/inLove.png'
import Sad from '@/app/img/Sad.png'
import Silly from '@/app/img/Silly.png'
import Anxious from '@/app/img/Anxious.png'
import Angry from '@/app/img/Angry.png'
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useDateDiary from "@/api/diary/useDateDiary";
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
        console.log(token);
        console.log(userData);
      } else {
        setIsHasToken(false);
      }
    }, [setIsHasToken]);

    console.log(userData);
    const [date, setDate] = useState<Date>(new Date());
    const searchParams = useSearchParams();
    const checkEdit = searchParams.get("edit");
    console.log(checkEdit);
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
    console.log("UserId: ",formattedDate);
    diary?.map((item) => {
        if (item.date === `${formattedDate}T00:00:00Z` && checkEdit !== "true") {
            router.push(`/diary/display`)
            return 0
        }
    }
    )

  return (
    <div>
        <div className="flex justify-center">
            <Image src={howareu} alt="How are you?" width={800}/> 
        </div>
        <div className="grid grid-rows-2 ">
            <div className="grid grid-cols-3 justify-center">
                <div className="flex justify-end">
                    <EmotionButton 
                        imageSrc={Happy} 
                        altText="Happy" 
                        particleSrc="https://i.postimg.cc/WzRvMbVY/Happy.png" 
                        imageSize={120}
                        date="21" 
                        buttonText="Happy"
                    />
                </div>
                <div className="flex justify-center">
                    <EmotionButton 
                        imageSrc={SoSo} 
                        altText="SoSo" 
                        particleSrc="https://i.postimg.cc/4NLWM27s/SoSo.png" 
                        imageSize={90}
                        date="21" 
                        buttonText="SoSo"
                    />
                </div>
                <div className="flex justify-start">
                    <EmotionButton 
                        imageSrc={InLove} 
                        altText="InLove" 
                        particleSrc="https://i.postimg.cc/Gt0NqnXJ/inLove.png" 
                        imageSize={120}
                        date="21" 
                        buttonText="InLove"
                    />
                </div>
            </div>
            <div  className="grid grid-cols-4 justify-center pt-5">
                <div className="flex justify-center">
                    <EmotionButton 
                        imageSrc={Sad} 
                        altText="Sad" 
                        particleSrc="https://i.postimg.cc/yY0WCpsM/Sad.png" 
                        imageSize={120}
                        date="21" 
                        buttonText="Sad"
                    />
                </div>
                <div className="flex justify-center">
                    <EmotionButton 
                        imageSrc={Anxious} 
                        altText="Anxious" 
                        particleSrc="https://i.postimg.cc/Rhn0BDSy/Anxious.png"
                        imageSize={150}
                        date="21" 
                        buttonText="Anxious"
                    />
                </div>
                <div className="flex justify-center">
                    <EmotionButton 
                        imageSrc={Angry} 
                        altText="Angry" 
                        particleSrc="https://i.postimg.cc/mD3syWrb/Angry.png"
                        imageSize={180}
                        date="21" 
                        buttonText="Angry"
                    />
                </div>
                <div className="flex justify-start pt-10">
                    <EmotionButton 
                        imageSrc={Silly} 
                        altText="Silly" 
                        particleSrc="https://i.postimg.cc/Hkb75VCR/Silly.png" 
                        imageSize={200}
                        date="21" 
                        buttonText="Silly"
                    />
                </div>
            </div>
        </div>
    </div>
        
  );
}