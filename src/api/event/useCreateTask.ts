import { CreateTask } from "@/interface/Task";
import axios from "@/lib/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import taskQueryKey from "./taskQueryKey";


const createTask = async (task:CreateTask ) => {
  const { data } = await axios.post(`/event`,task, {});
  return data;
};

const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKey.all });
    },
  });
};

export default useCreateTask;