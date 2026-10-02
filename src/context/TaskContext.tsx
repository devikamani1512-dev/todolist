import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export type RepeatType =
  | 'once'
  | 'daily'
  | 'weekdays'
  | 'custom';

export type Task = {
  id: string;
  title: string;
  category: string;
  time: string;
  repeat: RepeatType;
  startDate: string;
  endDate: string;
  customDates: string[];
  completedDates: string[];
  subtasks: string[];
  completedSubtasks: boolean[];
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (taskId: string, date: string) => void;
  isTaskCompleted: (taskId: string, date: string) => boolean;
  updateTask: (taskId: string, data: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskIndex: number) => void;
  addSubtask: (taskId: string, subtask: string) => void;
  deleteSubtask: (taskId: string, subtaskIndex: number) => void;
};

const TaskContext =
  createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = '@todo_tasks';

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Prepare presentation for team meeting',
    category: 'Work',
    time: '09:00',
    repeat: 'daily',
    startDate: '2026-10-01',
    endDate: '2026-10-30',
    customDates: [],
    completedDates: [],
    subtasks: [],
    completedSubtasks: [],
  },
  {
    id: '2',
    title: "Schedule doctor's appointment",
    category: 'Personal',
    time: '10:30',
    repeat: 'once',
    startDate: '2026-10-01',
    endDate: '2026-10-01',
    customDates: [],
    completedDates: [],
    subtasks: [],
    completedSubtasks: [],
  },
  {
    id: '3',
    title: 'Grocery shopping',
    category: 'Errands',
    time: '13:00',
    repeat: 'once',
    startDate: '2026-10-01',
    endDate: '2026-10-01',
    customDates: [],
    completedDates: [],
    subtasks: [],
    completedSubtasks: [],
  },
  {
    id: '4',
    title: "Read a chapter of 'The Great Gatsby'",
    category: 'Personal',
    time: '18:00',
    repeat: 'custom',
    startDate: '2026-10-01',
    endDate: '2026-10-30',
    customDates: [
      '2026-10-03',
      '2026-10-08',
      '2026-10-15',
      '2026-10-22',
      '2026-10-29',
    ],
    completedDates: [],
    subtasks: [],
    completedSubtasks: [],
  },
  {
    id: '5',
    title: 'Respond to emails',
    category: 'Work',
    time: '20:00',
    repeat: 'daily',
    startDate: '2026-10-01',
    endDate: '2026-10-30',
    customDates: [],
    completedDates: [],
    subtasks: [],
    completedSubtasks: [],
  },
];

export function TaskProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [tasksLoaded, setTasksLoaded] = useState(false);

  // Load saved tasks once when the provider starts.
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.log('Error loading tasks:', error);
      } finally {
        setTasksLoaded(true);
      }
    };

    loadTasks();
  }, []);

  // Save every task change after the initial load has completed.
  useEffect(() => {
    if (!tasksLoaded) return;

    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(tasks)
        );
      } catch (error) {
        console.log('Error saving tasks:', error);
      }
    };

    saveTasks();
  }, [tasks, tasksLoaded]);

  const addTask = (task: Task) => {
    setTasks((currentTasks) => [...currentTasks, task]);
  };

  const toggleTask = (taskId: string, date: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) return task;

        const alreadyCompleted = task.completedDates.includes(date);

        return {
          ...task,
          completedDates: alreadyCompleted
            ? task.completedDates.filter((item) => item !== date)
            : [...task.completedDates, date],
        };
      })
    );
  };

  const isTaskCompleted = (taskId: string, date: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return false;
    return task.completedDates.includes(date);
  };

  const updateTask = (taskId: string, data: Partial<Task>) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, ...data } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  };

  const toggleSubtask = (taskId: string, subtaskIndex: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) return task;

        const updatedCompletedSubtasks = [
          ...task.completedSubtasks,
        ];

        updatedCompletedSubtasks[subtaskIndex] =
          !updatedCompletedSubtasks[subtaskIndex];

        return {
          ...task,
          completedSubtasks: updatedCompletedSubtasks,
        };
      })
    );
  };

  const addSubtask = (taskId: string, subtask: string) => {
    const cleanSubtask = subtask.trim();
    if (!cleanSubtask) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) return task;

        return {
          ...task,
          subtasks: [...task.subtasks, cleanSubtask],
          completedSubtasks: [...task.completedSubtasks, false],
        };
      })
    );
  };

  const deleteSubtask = (taskId: string, subtaskIndex: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) return task;

        return {
          ...task,
          subtasks: task.subtasks.filter(
            (_, index) => index !== subtaskIndex
          ),
          completedSubtasks: task.completedSubtasks.filter(
            (_, index) => index !== subtaskIndex
          ),
        };
      })
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        isTaskCompleted,
        updateTask,
        deleteTask,
        toggleSubtask,
        addSubtask,
        deleteSubtask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      'useTasks must be used inside TaskProvider'
    );
  }

  return context;
}
