import { UpdateTag } from "@/interface/Tag";
import axios from "@/lib/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import tagQueryKey from "./tagQueryKey";

const updateTag = async ({ id,tag }: { id: string; tag: UpdateTag }) => {
    const { data } = await axios.patch(`/tag/${id}`,tag, {});
    return data;
}

const useUpdateTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tagQueryKey.all });
        },
    });
};

export default useUpdateTag;