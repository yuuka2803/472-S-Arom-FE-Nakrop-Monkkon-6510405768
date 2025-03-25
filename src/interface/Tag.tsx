export interface Tag {
    id: string;
    name: string;
    user_id: string;
}

export interface CreateTag {
    name: string;
    user_id: string;
}

export interface UpdateTag {
    name: string;
}
export interface ShowTag {
    name: string;
    user_id: string;
}

