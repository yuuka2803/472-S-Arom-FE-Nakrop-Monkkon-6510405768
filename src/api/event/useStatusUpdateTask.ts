import { CreateTask, UpdateStatusTask} from "@/interface/Task";
import axios from "@/lib/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import taskQueryKey from "./taskQueryKey";


const updateStatusTask = async ({ id,task }: { id: string; task: UpdateStatusTask }) => {
  console.log("🔍 Sending request with ID:", id, "Task:", task); // Debug
  const { data } = await axios.patch(`/event/status/${id}`,task, {});
  return data;
};

const useUpdateStatusTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStatusTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKey.all });
    },
  });
};

export default useUpdateStatusTask;