import { Tag } from "@/interface/Tag";
import axios from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";
import tagQueryKey from "./tagQueryKey";

const fetchUserIdTag = async (id: string ) => {
    const response = await axios.get<Tag[]>(`/tag/user/${id}`,)
    return response.data;
}

const useUserIdTag= (id: string) => {
    return useQuery({
        queryKey: tagQueryKey.user(id),
        queryFn: async () => await fetchUserIdTag(id),
    })
};

export default useUserIdTag;