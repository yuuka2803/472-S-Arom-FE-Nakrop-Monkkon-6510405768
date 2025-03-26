"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { jwtDecode } from "jwt-decode";
import type { Task, CreateTask } from "@/interface/Task";
import useCreateTask from "@/api/event/useCreateTask";
import useUserIdTask from "@/api/event/useUserIdTask";
import { useRouter } from "next/navigation";
import { AddTask } from "@/components/create-task";
import useUpdateTask from "@/api/event/useUpdateTask";
import useUpdateStatusTask from "@/api/event/useStatusUpdateTask";
import { MdEdit } from "react-icons/md";
import { Pencil, Trash2, Check, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTag, UpdateTag } from "@/interface/Tag";
import useCreateTag from "@/api/tag/useCreateTag";
import useUserIdTag from "@/api/tag/useUserIdTag";
import deleteTag from "@/api/tag/useDeleteTag";
import useUpdateTag from "@/api/tag/useUpdateTag";
import useIdTag from "@/api/tag/useIdTag";

type TagType = string;

const tagColor = "bg-arom_brown hover:bg-arom_brown";

export default function TaskPage() {
  const [filterTag, setFilterTag] = useState<TagType>("All");
  const [userData, setUserData] = useState<any>(null);
  const [isHasToken, setIsHasToken] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsHasToken(true);
      setUserData(jwtDecode(token));
      
    } else {
      setIsHasToken(false);
    }
  }, []);

  const createTask = useCreateTask();
  const updateStatusTask = useUpdateStatusTask(); 
  const { data: tasks, isLoading, error } = useUserIdTask(userData?.user_id, {
    enabled: !!userData?.user_id, // เรียกใช้งานก็ต่อเมื่อ user_id มีค่า
  });


  const router = useRouter();

  useEffect(() => {
    if (tasks) {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const updatedStatusTask = tasks.map((task: Task) => ({
          ...task,
          complete: parsedTasks[task.id]?.complete ?? task.complete,
        }));
        setLocalTasks(updatedStatusTask);
      } else {
        setLocalTasks(tasks);
      }
    }
  }, [tasks]);

  const handleAddTask = async (newTask: CreateTask) => {
    try {
      await createTask.mutateAsync(newTask);
      router.push("/task");
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const toggleTaskCompletion = async (taskId: string, complete: boolean) => {
    const updatedStatusTask = localTasks.map((task) =>
      task.id === taskId ? { ...task, complete: !complete } : task
    );
    setLocalTasks(updatedStatusTask);

    const taskCompletionState = updatedStatusTask.reduce((acc, task) => {
      acc[task.id] = { complete: task.complete };
      return acc;
    }, {} as Record<string, { complete: boolean }>);

    localStorage.setItem("tasks", JSON.stringify(taskCompletionState));

    await updateStatusTask.mutateAsync({
      id: taskId,
      task: { completed: !complete },
    });
  };

  const filteredTasks = localTasks.filter(
    (task: Task) => filterTag === "All" || task.tag === filterTag
  );
  if(isLoading)
    return <p>Loading.....</p>
   if(error)
    return <p>{error.message}</p>

  return (
    <div>
      <div className="w-full py-[20px]">
        <div className="p-4">
          <AddTask onAddTask={handleAddTask} userId={userData?.user_id} />

          <TagFilter currentFilter={filterTag} onFilterChange={setFilterTag} />

          <div className="mt-8 space-y-8">
            <TaskSection
              title="Upcoming"
              tasks={filteredTasks.filter((task: Task) => !task.complete)}
              toggleTaskCompletion={toggleTaskCompletion}
            />
            <TaskSection
              title="Completed"
              tasks={filteredTasks.filter((task: Task) => task.complete)}
              toggleTaskCompletion={toggleTaskCompletion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TagFilter({
  currentFilter,
  onFilterChange,
}: {
  currentFilter: TagType;
  onFilterChange: (tag: TagType) => void;
}) {
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [editValue, setEditValue] = useState<TagType>("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState<string>("");
  const [isHasToken, setIsHasToken] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsHasToken(true);
      setUserData(jwtDecode(token));
    } else {
      setIsHasToken(false);
    }
  }, []);

  const userId = userData?.user_id;
  console.log("User ID:", userId);

  const {
    data: fetchedTags,
    isLoading,
    error,
  } = useUserIdTag(userData?.user_id);

  const [tags, setTags] = useState<string[]>(["All"]);
  const [tagMap, setTagMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (fetchedTags) {
      const tagNames = fetchedTags.map((tag) => tag.name);
      const tagMapTemp = new Map(
        fetchedTags.map((tag) => [tag.id.toString(), tag.name]) // Map to get id -> name
      );
      setTags(["All", ...tagNames]);
      setTagMap(tagMapTemp);
    }
  }, [fetchedTags]);

  console.log("Tags:", tags);
  console.log("Tag Map:", tagMap);

  const handleEdit = (tag: TagType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tag selection when clicking edit
    setEditingTag(tag);
    setEditValue(tag);
  };

  const handleSaveEdit = async (oldTag: TagType, e: React.MouseEvent) => {
    const tagId = [...tagMap.entries()].find(
      ([id, name]) => name === oldTag
    )?.[0];

    if (!tagId) {
      console.error(`Tag ID not found for tag: ${oldTag.toString()}`);
      return;
    }

    await updateTag.mutateAsync({
      id: tagId,
      tag: { name: editValue },
    });
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tag selection when clicking cancel
    setEditingTag(null);
  };

  const handleDelete = async (tagName: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (tagName === "All") return;

    // Find the tag ID based on the tag name
    const tagId = [...tagMap.entries()].find(
      ([id, name]) => name === tagName
    )?.[0];

    if (!tagId) {
      console.error(`Tag ID not found for tag: ${tagName}`);
      return;
    }

    try {
      console.log(`Deleting tag: ${tagName} with ID: ${tagId}`);
      await deleteTag(tagId); // Call the API to delete from the database

      // Update the state to remove the deleted tag
      setTags((prevTags) => prevTags.filter((tag) => tag !== tagName));

      // Remove the deleted tag from tagMap
      setTagMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(tagId);
        return newMap;
      });

      // If the deleted tag was selected, reset filter to "All"
      if (currentFilter === tagName) {
        onFilterChange("All");
      }
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const handleAddTag = async () => {
    if (newTag.trim() === "") return;

    const newTags: CreateTag = {
      name: newTag,
      user_id: userId,
    };
    try {
      console.log("New Tag:", newTags);
      await createTag.mutateAsync(newTags);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to create tag:", err);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag) => (
        <div key={tag} className="relative group">
          {editingTag === tag ? (
            <div className="flex items-center gap-1 rounded-full bg-white border border-input p-1">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value as TagType)}
                className="h-6 w-20 text-xs border-none focus-visible:ring-0"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => handleSaveEdit(tag, e)}
                className="h-5 w-5 p-0"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancelEdit}
                className="h-5 w-5 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant={currentFilter === tag ? "default" : "outline"}
              onClick={() => onFilterChange(tag)}
              className={cn(
                "rounded-full",
                "w-fit",
                "flex items-center",
                currentFilter === tag
                  ? `${tagColor} text-white`
                  : `text-arom_brown hover:text-arom_brown`
              )}
            >
              {tag}

              {tag !== "All" && (
                <div className={cn("ml-2 flex items-center gap-1")}>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => handleEdit(tag, e)}
                    className="h-5 w-5 p-0 text-arom_brown hover:text-arom_brown hover:bg-transparent"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => handleDelete(tag, e)}
                    className="h-5 w-5 p-0 text-arom_brown hover:text-red-600 hover:bg-transparent"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </Button>
          )}
        </div>
      ))}

      {/* Add new tag button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-arom_brown"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Tag
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Tag Name
              </label>
              <Input
                id="name"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            <Button onClick={handleAddTag} className="w-full">
              Create Tag
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskSection({
  title,
  tasks,
  toggleTaskCompletion,
}: {
  title: string;
  tasks: Task[];
  toggleTaskCompletion: (taskId: string, complete: boolean) => void;
}) {
  return (
    <section>
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            toggleTaskCompletion={toggleTaskCompletion}
          />
        ))}
      </div>
    </section>
  );
}

function TaskItem({
  task,
  toggleTaskCompletion,
}: {
  task: Task;
  toggleTaskCompletion: (taskId: string, complete: boolean) => void;
}) {
  const router = useRouter();
  const {data:tagName, isLoading, error} = useIdTag(task.tag)
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          className="form-checkbox"
          checked={task.complete}
          onChange={() => toggleTaskCompletion(task.id, task.complete)}
          aria-label={`Mark "${task.title}" as ${task.complete ? true : false}`}
        />
        <div>
          <p
            className={
              task.complete ? "line-through text-muted-foreground" : ""
            }
          >
            {task.title}
          </p>
          <p className="text-sm text-muted-foreground">{task.description}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(task.start).toLocaleString()} -{" "}
            {new Date(task.end).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <span
          className={cn("text-white rounded-full px-2 py-1 text-xs", tagColor)}
        >
          {tagName?.name}
        </span>
        <MdEdit onClick={() => router.push(`task/edit/${task.id}`)}/>
      </div>
    </div>
  );
}
