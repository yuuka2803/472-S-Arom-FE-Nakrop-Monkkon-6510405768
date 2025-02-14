import { CreateDiary } from "@/interface/Diary";
import axios from "@/lib/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import diaryQueryKey from "./diaryQueryKey";


const createDiary = async (diary: CreateDiary) => {
  const { data } = await axios.post(`/diary`,diary, {});
  return data;
};

const useCreateDiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDiary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diaryQueryKey.all });
    },
  });
};

export default useCreateDiary;