import { CreateTag } from "@/interface/Tag";
import axios from "@/lib/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import tagQueryKey from "./tagQueryKey";

const createTag = async (tag:CreateTag ) => {
    const { data } = await axios.post(`/tag`,tag, {});
    return data;
}

const useCreateTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tagQueryKey.all });
        },
    });
};

export default useCreateTag;
