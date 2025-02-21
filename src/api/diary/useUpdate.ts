import { useMutation, useQueryClient } from "@tanstack/react-query";
import diaryQueryKey from "./diaryQueryKey";
import axios from "@/lib/axios.config";
import { Diary, UpdateDiary } from "@/interface/Diary";

const updateDiaries = async ({
  date,
  diary,
}: {
  date: string;
  diary: UpdateDiary;
}) => {
    const formData = new FormData();

    formData.append("date", diary.date);
    formData.append("mood", diary.mood);
    formData.append("user_id", diary.user_id);
    formData.append("description", diary.description);
  
    diary.emotions.forEach((emotion:string) => {
      formData.append("emotions", emotion);
    });
      
    diary.images_url.forEach((url:string) => {
        formData.append("images_url",url);
      });
  
    diary.images.forEach((image: File) => {
      formData.append("images", image);
    });
  const { data } = await axios.patch<Diary>(`/diary/${date}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

const useUpdateDiaries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDiaries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diaryQueryKey.all });
    },
  });
};

export default useUpdateDiaries;
