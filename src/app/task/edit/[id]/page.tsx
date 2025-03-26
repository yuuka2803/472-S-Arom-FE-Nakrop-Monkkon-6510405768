"use client";
import useIdTask from "@/api/event/useIdTask";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, UpdateTask } from "@/interface/Task";
import { Input, Textarea } from "@nextui-org/react";
import { Label } from "@radix-ui/react-label";
import { useParams, useRouter } from "next/navigation";
import { set } from "zod";
import useUpdateTask from "@/api/event/useUpdateTask";
import useUserIdTag from "@/api/tag/useUserIdTag";
const reminderOptions = {
  None: "None",
  "1h": "1 hour before",
  "5h": "5 hours before",
  "24h": "1 day before",
  "48h": "2 days before",
};

export default function EditTask() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading, error } = useIdTask(id);
  const updateTask = useUpdateTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedTimeRemind, setSelectedTimeRemind] = useState<string>("none");
  const {data:tags,isLoading:isTagLoading,error:isTagError} = useUserIdTag(task?.user_id || "");
  const onSubmit = async () => {
    if (title.trim() && startDate && startTime && endDate && endTime && task) {
      const startDateTime = `${startDate}T${startTime}:00Z`;
      const endDateTime = `${endDate}T${endTime}:00Z`;

      const newUpdatedTask: UpdateTask = {
        title: title,
        description: description,
        start: startDateTime,
        end: endDateTime,
        tag: selectedTag,
        notification: task?.notification,
        reminder: selectedTimeRemind,
        user_id: task.user_id
      };
      await updateTask.mutateAsync({ id, task: newUpdatedTask });
      router.push("/task");
    }
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStartDate(
        task.start ? new Date(task.start).toISOString().split("T")[0] : ""
      );
      setEndDate(
        task.end ? new Date(task.end).toISOString().split("T")[0] : ""
      );
      setStartTime(
        task.start ? new Date(task.start).toTimeString().slice(0, 5) : ""
      );
      setEndTime(task.end ? new Date(task.end).toTimeString().slice(0, 5) : "");
      setSelectedTag(task.tag);
      if (task?.reminder) {
        setSelectedTimeRemind(task.reminder);
      }
    }
  }, [task]);

  return (
    <div className="grid gap-4 p-10">
      <p className="text-3xl font-semibold">Edit Task</p>
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
        <Label htmlFor="remind">Notification</Label>
        <Select
          value={selectedTimeRemind}
          onValueChange={setSelectedTimeRemind}
        >
          <SelectTrigger id="remind">
            <SelectValue>
              {
                reminderOptions[
                  selectedTimeRemind as keyof typeof reminderOptions
                ]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(reminderOptions).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tag">Tag</Label>
        <Select
          defaultValue={task?.tag}
          value={selectedTag}
          onValueChange={(value) => setSelectedTag(value)}
        >
          <SelectTrigger id="tag">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>
                {tags?.map((tag)=>(
                    <SelectItem value={tag.id}>{tag.name}</SelectItem>
                ))}
              </SelectContent>
        </Select>
      </div>
      <Button
        className="w-full bg-arom_brown hover:bg-arom_gray"
        onClick={onSubmit}
      >
        Save
      </Button>
    </div>
  );
}
