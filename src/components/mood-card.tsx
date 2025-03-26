'use client'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";

interface MoodCardProps {
  setEmotions: (emotions: string[]) => void;
  emotions: string[];
}

export function MoodCard({ setEmotions, emotions }: MoodCardProps) {
  const [selectEmotions, setSelectedEmotions] = useState<string[]>(emotions);
  useEffect(() => {
    setSelectedEmotions(emotions);
  }, [emotions]);

  const handleValueChange = (value: string[]) => {
    setEmotions(value);
  };

  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      className="grid grid-cols-4 gap-x-3 gap-y-2"
      defaultValue={selectEmotions}
      
      onValueChange={handleValueChange}
    >
      {[
        "Excited", "Hopeful", "Happy", "Sad", "Tired", "Proud",
        "Anxious", "Bored", "Relaxed", "Refreshed", "Lonely", "Stressed"
      ].map((mood) => (
        <ToggleGroupItem
          key={mood}
          value={mood}
          className={`font-medium py-0 rounded-3xl text-sm data-[state=off]:text-[#9B826F] hover:bg-[#EFE9E4] data-[state=on]:bg-white data-[state=on]:text-arom_brown
            ${selectEmotions.includes(mood) ? "bg-white text-arom_brown" : "bg-[#D9CEC5] text-[#9B826F]"}`}
        >
          {mood}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
