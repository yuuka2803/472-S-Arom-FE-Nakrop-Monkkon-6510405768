import { Diary } from "@/interface/Diary";
import axios from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";
import diaryQueryKey from "./diaryQueryKey";

const fetchUserIdDiary = async (id: string ) => {

    const response = await axios.get<Diary[]>(`/diary/user/${id}`,)

    return response.data;
}

const useUserIdDiary= (id: string) => {
    return useQuery({
        queryKey: diaryQueryKey.user(id),
        queryFn: async () => await fetchUserIdDiary(id),
    })
};

export default useUserIdDiary;
