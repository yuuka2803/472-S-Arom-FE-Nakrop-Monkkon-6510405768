export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  color:
    | "pink"
    | "lightGreen"
    | "yellow"
    | "purple"
    | "red"
    | "blue"
    | "orange"
    | "green"
    | "brown";
  type: "event";
};

export type Task = {
  id: string;
  title: string;
  description: string;
  complete: boolean;
  start: Date;
  end: Date;
  tag: string; //personal, work, etc.
  type: "task";
  user_id: string;
};

export type Diary = {
  id: string;
  date: Date;
  mood: "Happy" | "So So" | "In Love" | "Sad" | "Silly" | "Anxious" | "Angry";
  emotions: string[];
  description: string;
  type: string;
  user_id: string;
};

export interface CalendarItem {
  id: string;
  date: Date;
  type: "task" | "diary";
  title?: string;
}