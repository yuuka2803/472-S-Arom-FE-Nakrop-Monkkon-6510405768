"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Tags } from "lucide-react";
import type { CreateTask } from "@/interface/Task";
import useCreateTask from "@/api/event/useCreateTask";
import { useRouter } from "next/navigation";

type TagType = string;

interface AddTaskProps {
  onAddTask: (task: CreateTask) => Promise<void>;
  userId: string;
}

const defaultTags = [
  { value: "Personal", label: "Personal" },
  { value: "Work", label: "Work" },
  { value: "Study", label: "Study" },
];

export function AddTask({ onAddTask, userId }: AddTaskProps) {
  const createTask = useCreateTask();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [newTagDialogOpen, setNewTagDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedTag, setSelectedTag] = useState<TagType>("Personal");

  const allTags = [...defaultTags];

  const handleAddTask = async () => {
    if (title.trim() && startDate && startTime && endDate && endTime) {
      const startDateTime = `${startDate}T${startTime}:00Z`;
      const endDateTime = `${endDate}T${endTime}:00Z`;
      const newTask: CreateTask = {
        title: title,
        description: description,
        start: startDateTime,
        end: endDateTime,
        tag: selectedTag,
        user_id: userId,
      };
      try {
        console.log("New Task:", newTask);
        await createTask.mutateAsync(newTask);
        router.push("/task");
        setOpen(false);
        resetForm();
      } catch (err) {
        console.error("Failed to create task:", err);
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setSelectedTag("Personal");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-arom_brown text-xl">
              Add New Task
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task">Task Name</Label>
              <Input
                id="task"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tag">Tag</Label>
              </div>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {allTags.map((tag) => (
                    <SelectItem key={tag.value} value={tag.value}>
                      {tag.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-arom_brown" onClick={handleAddTask}>
              Add Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
