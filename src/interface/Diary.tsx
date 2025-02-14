export interface Diary {
    id: string;
    date: string;
    mood: string;
    emotions: string[];
    description: string;
    type: string;
    user_id: string;
    }

export interface CreateDiary {
    date: string;
    mood: string;
    emotions: string[];
    description: string;
    user_id: string;
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
      