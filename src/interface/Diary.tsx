export interface Diary {
  id: string;
  date: string;
  mood: string;
  emotions: string[];
  description: string;
  type: string;
  user_id: string;
  images: string[];
}

export interface CreateDiary {
  date: string;
  mood: string;
  emotions: string[];
  description: string;
  user_id: string;
  images: File[];
}

export interface UpdateDiary {
    date: string;
    mood: string;
    emotions: string[];
    description: string;
    user_id: string;
    images_url: string[];
    images: File[];
  }
export interface ShowDiary {
  id: string;
  date: Date;
  mood: string;
  emotions: string[];
  description: string;
  type: string;
  user_id: string;
}
