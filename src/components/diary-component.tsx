// "use client";

// import { useState } from "react";
// import Image, { StaticImageData } from "next/image";
// import { useSearchParams } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// // import { Diary } from "../../type/types"
// import { Diary } from "@/interface/Diary";
// import Happy from "@/app/img/Happy.png";
// import SoSo from "@/app/img/SoSo.png";
// import InLove from "@/app/img/inLove.png";
// import Sad from "@/app/img/Sad.png";
// import Silly from "@/app/img/Silly.png";
// import Anxious from "@/app/img/Anxious.png";
// import Angry from "@/app/img/Angry.png";

// const moodImages: { [key in Diary["mood"]]: StaticImageData } = {
//   Happy: Happy,
//   "So So": SoSo,
//   "In Love": InLove,
//   Sad: Sad,
//   Silly: Silly,
//   Anxious: Anxious,
//   Angry: Angry,
// };

// export function DiaryComponent({ diary }: { diary: Diary }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const searchParams = useSearchParams();

//   const emotion = searchParams.get("emotion") || "Unknown Emotion";
//   console.log(emotion);
//   const moodFromUrl = searchParams.get("mood") as Diary["mood"] | null;
//   const mood = moodFromUrl || diary.mood;
//   console.log(mood);

//   const imageSrc = moodImages[mood] || "/img/default.png";

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Image
//           src={imageSrc}
//           width={100}
//           height={100}
//           alt={`Mood: ${mood}`}
//           className="cursor-pointer"
//         />
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] flex flex-col">
//         <DialogHeader>
//           <DialogTitle className="text-2xl">Your Mood Today</DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="flex-grow">
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-start gap-4">
//               <span className="text-md font-medium">Mood:</span>
//               <span className="col-span-3 text-md font-medium capitalize">
//                 {mood}
//               </span>
//             </div>
//             <div className="grid grid-cols-4 items-start gap-4">
//               <span className="text-md font-medium">Description:</span>
//               <span className="col-span-3 text-md break-words">
//                 {diary.description}
//               </span>
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <span className="text-md font-medium">Date:</span>
//               <span className="col-span-3 text-md">
//                 {new Date(diary.date).toLocaleDateString()}
//               </span>
//             </div>
//             {/* <div className="grid grid-cols-4 items-start gap-4">
//               <span className="text-md font-medium">Emotions:</span>
//               <div className="col-span-3 flex flex-wrap gap-2">
//                 {diary.emotions.map((emotion, index) => (
//                   <Badge key={index} className="bg-yellow-500 hover:bg-yellow-400">
//                     {emotion}
//                   </Badge>
//                 ))}
//               </div>
//             </div> */}
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }
