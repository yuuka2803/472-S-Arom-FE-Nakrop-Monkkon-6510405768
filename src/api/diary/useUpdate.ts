import { useMutation, useQueryClient } from "@tanstack/react-query";
import diaryQueryKey from "./diaryQueryKey";
import axios from "@/lib/axios.config";
import { CreateDiary, Diary } from "@/interface/Diary";

const updateDiaries = async ({ date, diary }: { date: string; diary: CreateDiary }) => {

    const { data } = await axios.put<Diary>(`/diary/${date}`, diary);
    return data;
};

const useUpdateDiaries = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDiaries,
        onSuccess: ( ) => {
            queryClient.invalidateQueries({ queryKey: diaryQueryKey.all });
        },
    });
}

export default useUpdateDiaries;