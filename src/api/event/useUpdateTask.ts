import { CreateTask, UpdateTask } from "@/interface/Task";
import axios from "@/lib/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import taskQueryKey from "./taskQueryKey";


const updateTask = async ({ id,task }: { id: string; task: UpdateTask }) => {
  const { data } = await axios.patch(`/event/${id}`,task, {});
  return data;
};

const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKey.all });
    },
  });
};

export default useUpdateTask;