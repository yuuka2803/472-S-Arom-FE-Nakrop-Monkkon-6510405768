import { Tag } from "@/interface/Tag";
import axios from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";
import tagQueryKey from "./tagQueryKey";

const fetchIdTag = async (id: string ) => {
    const response = await axios.get<Tag>(`/tag/${id}`,)
    return response.data;
}

const useIdTag= (id: string) => {
    return useQuery({
        queryKey: tagQueryKey.id(id),
        queryFn: async () => await fetchIdTag(id),
    })
};

export default useIdTag;