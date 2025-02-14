import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface MoodCardDisplayProps {
  selectedEmotions: string[];
}

export default function MoodCardDisplay({ selectedEmotions }: MoodCardDisplayProps) {
  return (
    <ToggleGroup
      type="multiple"
      className="grid grid-cols-4 gap-x-3 gap-y-2"
    >
      {[
        "Excited",
        "Hopeful",
        "Happy",
        "Sad",
        "Tired",
        "Proud",
        "Anxious",
        "Bored",
        "Relaxed",
        "Refreshed",
        "Lonely",
        "Stressed",
      ].map((mood) => (
        <ToggleGroupItem
          key={mood}
          value={mood}
          className={`font-medium rounded-3xl text-sm  pointer-events-none ${
            selectedEmotions.includes(mood)
              ? "bg-white text-arom_brown"
              : "bg-[#D9CEC5] text-arom_brown"
          }`}
        >
          {mood}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
