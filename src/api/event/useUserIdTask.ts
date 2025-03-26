
import { Task } from "@/interface/Task";
import axios from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";
import taskQueryKey from "./taskQueryKey";


const fetchUserIdTask = async (id: string ) => {
    const response = await axios.get<Task[]>(`/event/user/${id}`,)
    return response.data;
}

const useUserIdTask= (id: string, p0: { enabled: boolean; }) => {
    return useQuery({
        queryKey: taskQueryKey.user(id),
        queryFn: () => fetchUserIdTask(id as string), // ใช้ as string เพราะ `enabled` คุมไม่ให้รันตอน `userId` เป็น undefined
        enabled: !!id,
    })
};

export default useUserIdTask;
