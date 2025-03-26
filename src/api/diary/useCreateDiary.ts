import { CreateDiary } from "@/interface/Diary";
import axios from "@/lib/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import diaryQueryKey from "./diaryQueryKey";

const createDiary = async (diary: CreateDiary) => {
  const formData = new FormData();
  formData.append("date", diary.date);
  formData.append("mood", diary.mood);
  formData.append("user_id", diary.user_id);
  formData.append("description", diary.description);

  diary.emotions.forEach((emotion:string) => {
    formData.append("emotions", emotion);
  });

  diary.images.forEach((image: File) => {
    formData.append("images", image);
  });
  const { data } = await axios.post(`/diary`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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
