import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Pencil, Trash2, Check, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTag } from "@/interface/Tag";
import useCreateTag from "@/api/tag/useCreateTag";
import useUserIdTag from "@/api/tag/useUserIdTag";
import deleteTag from "@/api/tag/useDeleteTag";
import { jwtDecode } from "jwt-decode";
import { Button, ButtonWrapper } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const tagColor = "bg-arom_brown hover:bg-arom_brown";

function TagFilter({
  currentFilter,
  onFilterChange,
}: {
  currentFilter: string;
  onFilterChange: (tag: string) => void;
}) {

  const createTag = useCreateTag();
  const [newTag, setNewTag] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tags, setTags] = useState(["All"]);
  const [tagMap, setTagMap] = useState(new Map());
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setUserData(jwtDecode(token));
    }
  }, []);

  type UserData = {
    user_id: string;
  };
  
  const [userData, setUserData] = useState<UserData | null>(null);
  
  

  const { data: fetchedTags } = useUserIdTag(userData?.user_id || "");

  useEffect(() => {
    if (fetchedTags) {
      const tagNames = fetchedTags.map(tag => tag.name);
      setTags(["All", ...tagNames]);
      setTagMap(new Map(fetchedTags.map(tag => [tag.id.toString(), tag.name])));
    }
  }, [fetchedTags]);

  const handleDelete = async (
    tagName: string,
    e: { stopPropagation: () => void }
  ) => {
    e.stopPropagation();
    if (tagName === "All") return;
    
    const tagId = [...tagMap.entries()].find(([id, name]) => name === tagName)?.[0];
    if (!tagId) return;
    
    try {
      await deleteTag(tagId);
      setTags(prevTags => prevTags.filter(tag => tag !== tagName));
      setTagMap(prevMap => {
        const newMap = new Map(prevMap);
        newMap.delete(tagId);
        return newMap;
      });
      if (currentFilter === tagName) onFilterChange("All");
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    if (!userData?.user_id) {
      console.error("User ID is missing");
      return;
    }
    const newTags = { name: newTag, user_id: userData.user_id };
    try {
      await createTag.mutateAsync(newTags);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to create tag:", err);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
 {tags.map((tag) => (
         <Button
           key={tag}
           onClick={() => onFilterChange(tag)}
           className={cn(
             "rounded-full",
             currentFilter === tag
               ? `${tagColor} text-white`
               : "text-arom_brown hover:text-arom_brown"
           )}
         >
           {" "}
           {tag}{" "}
         </Button>
            ))}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
        <ButtonWrapper
               variant="outline"
               size="sm"
               className="rounded-full text-arom_brown"
             >
               <Plus className="h-4 w-4 mr-1" /> Add Tag
             </ButtonWrapper>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <Input
             value={newTag}
             onChange={(e) => setNewTag(e.target.value)}
             placeholder="Enter tag name"
           />
           <Button onClick={handleAddTag} className="w-full">
             {" "}
             Create Tag{" "}
           </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TagFilter;