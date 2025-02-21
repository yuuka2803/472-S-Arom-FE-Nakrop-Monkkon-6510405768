"use client";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { CoolMode } from "@/components/ui/cool-mode";

interface EmotionButtonProps {
  imageSrc: string | StaticImageData;
  altText: string;
  particleSrc: string;
  imageSize?: number;
  date: string;
  buttonText: string;
}

export default function EmotionButton({
  imageSrc,
  altText,
  particleSrc,
  imageSize = 100,
  date,
  buttonText,
}: EmotionButtonProps) {
  const router = useRouter();

  const navigateTo = `/diary/create/?mood=${buttonText}`;
  const handleNavigation = () => {
    router.push(navigateTo);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <CoolMode
        options={{
          particle: particleSrc,
          size: 50,
          particleCount: 10,
        }}
      >
        <button onClick={handleNavigation}>
          <img
            src={typeof imageSrc === "string" ? imageSrc : imageSrc.src}
            alt={altText}
            width={imageSize}
            height={imageSize}
            className="w-[120px] h-[120px] object-contain"
          />
        </button>
      </CoolMode>
      <p className="mt-10 font-semibold text-xl">{buttonText}</p>
    </div>
  );
}
