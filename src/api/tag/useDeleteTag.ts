import { Tag } from "@/interface/Tag";
import axios from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";
import tagQueryKey from "./tagQueryKey";

const deleteTag = async (id: string) => {
    const response = await axios.delete(`/tag/${id}`,);
    return response.data;
}

export default deleteTag;