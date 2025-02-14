
import { useQuery } from "@tanstack/react-query";
import taskQueryKey from "./taskQueryKey";
import { Task } from "@/interface/Task";
import axios from "@/lib/axios.config";


const fetchTasks = async () => {
    const data = await axios.get<Task[]>(`/event`,);
    return data;
}


const useTasks = () => {

    return useQuery({
            queryKey: taskQueryKey.all,
            queryFn: fetchTasks,
        })
    };
    
    export default useTasks;
    