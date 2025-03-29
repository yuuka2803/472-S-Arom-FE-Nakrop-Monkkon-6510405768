import { Diary } from "@/interface/Diary";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import diaryQueryKey from "./diaryQueryKey";

const fetchDiaries = async () => {
  const data = await axios.get<Diary>("/diary");
  return data;
};

const useDiaries = () => {
  return useQuery({
    queryKey: diaryQueryKey.all,
    queryFn: fetchDiaries,
  });
};

export default useDiaries;
