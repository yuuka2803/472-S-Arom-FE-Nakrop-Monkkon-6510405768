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
import { Pencil, Trash2, Check, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TagType = "Personal" | "Work" | "Study" | "All";

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
  const updateTask = useUpdateTask();
  const { data: tasks, isLoading, error } = useUserIdTask(userData?.user_id);

  const router = useRouter();

  useEffect(() => {
    if (tasks) {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const updatedTasks = tasks.map((task: Task) => ({
          ...task,
          complete: parsedTasks[task.id]?.complete ?? task.complete,
        }));
        setLocalTasks(updatedTasks);
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
    const updatedTasks = localTasks.map((task) =>
      task.id === taskId ? { ...task, complete: !complete } : task
    );
    setLocalTasks(updatedTasks);

    const taskCompletionState = updatedTasks.reduce((acc, task) => {
      acc[task.id] = { complete: task.complete };
      return acc;
    }, {} as Record<string, { complete: boolean }>);

    localStorage.setItem("tasks", JSON.stringify(taskCompletionState));

    await updateTask.mutateAsync({
      id: taskId,
      task: { completed: !complete },
    });
  };

  const filteredTasks = localTasks.filter(
    (task: Task) => filterTag === "All" || task.tag === filterTag
  );

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
  const [tags, setTags] = useState<TagType[]>([
    "All",
    "Personal",
    "Work",
    "Study",
  ]);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [editValue, setEditValue] = useState<TagType>("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState<string>("");

  const handleEdit = (tag: TagType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tag selection when clicking edit
    setEditingTag(tag);
    setEditValue(tag);
  };

  const handleSaveEdit = (oldTag: TagType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tag selection when clicking save
    if (editValue.trim() === "") return;

    // Update the tags array
    const newTags = tags.map((tag) =>
      tag === oldTag ? (editValue as TagType) : tag
    );
    setTags(newTags);

    // If the edited tag was selected, update the current filter
    if (currentFilter === oldTag) {
      onFilterChange(editValue as TagType);
    }

    setEditingTag(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tag selection when clicking cancel
    setEditingTag(null);
  };

  const handleDelete = (tag: TagType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tag selection when clicking delete

    // Don't allow deleting the "All" tag
    if (tag === "All") return;

    // Remove the tag from the array
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);

    // If the deleted tag was selected, set filter to "All"
    if (currentFilter === tag) {
      onFilterChange("All");
    }
  };

  const handleAddTag = () => {
    if (newTagName.trim() === "") return;

    // Add the new tag to the array
    setTags([...tags, newTagName as TagType]);
    setNewTagName("");
    setIsDialogOpen(false);
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
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
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
          {task.tag}
        </span>
      </div>
    </div>
  );
}
