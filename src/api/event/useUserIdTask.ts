import { Task } from "@/interface/Task";
import axios from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";
import taskQueryKey from "./taskQueryKey";

const fetchUserIdTask = async (id: string) => {
  const response = await axios.get<Task[]>(`/event/user/${id}`);
  return response.data;
};

const useUserIdTask = (id: string) => {
  return useQuery({
    queryKey: taskQueryKey.user(id),
    queryFn: async () => await fetchUserIdTask(id),
  });
};

export default useUserIdTask;
