export interface Task {
  id: string;
  title: string;
  description: string;
  complete: boolean;
  start: Date;
  end: Date;
  tag: string; //personal, work, etc.
  type: "task";
  user_id: string;
}

export interface CreateTask {
  title: string;
  description: string;
  start: string;
  end: string;
  tag: string; //personal, work, etc.
  user_id: string;
}

export interface UpdateTask {
  completed: boolean;
}
