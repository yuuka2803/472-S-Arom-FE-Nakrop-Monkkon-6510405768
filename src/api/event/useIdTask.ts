
import { Task } from "@/interface/Task";
import axios from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";
import taskQueryKey from "./taskQueryKey";


const fetchIdTask = async (id: string ) => {

    const response = await axios.get<Task>(`/event/${id}`,)

    return response.data;
}

const useIdTask= (id: string) => {
    return useQuery({
        queryKey: taskQueryKey.id(id),
        queryFn: async () => await fetchIdTask(id),
    })
};

export default useIdTask;
