import { Diary } from "@/interface/Diary";
import axios from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";
import diaryQueryKey from "./diaryQueryKey";

const fetchDateDiary = async (date: string ) => {

    const response = await axios.get<Diary>(`/diary/date/${date}`,)
    return response.data;
}

const useDateDiary= (date: string) => {
    return useQuery({
        queryKey: diaryQueryKey.date(date),
        queryFn: async () => await fetchDateDiary(date),
    })
};

export default useDateDiary;
