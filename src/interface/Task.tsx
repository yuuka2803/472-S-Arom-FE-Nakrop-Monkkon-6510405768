export interface Task {
  id: string;
  title: string;
  description: string;
  complete: boolean;
  start: Date;
  end: Date;
  tag: string; //personal, work, etc.
  notification: boolean;
  reminder: string;
  type: "task";
  user_id: string;
}

export interface CreateTask {
  title: string;
  description: string;
  start: string;
  end: string;
  tag: string; //personal, work, etc.
  notification: boolean;
  reminder: string;
  user_id: string;
}

export interface UpdateStatusTask {
  completed: boolean;
}

export interface UpdateTask {
  title: string;
  description: string;
  start: string;
  end: string;
  tag: string;
  notification: boolean;
  reminder: string;
  user_id: string;
}