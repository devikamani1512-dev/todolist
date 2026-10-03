import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

// =====================================================
// REPEAT TYPE
// =====================================================

export type RepeatType =
  | 'once'
  | 'daily'
  | 'weekdays'
  | 'custom';

// =====================================================
// TASK TYPE
// =====================================================

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

// =====================================================
// CONTEXT TYPE
// =====================================================

type TaskContextType = {
  tasks: Task[];

  addTask: (task: Task) => void;

  toggleTask: (
    taskId: string,
    date: string
  ) => void;

  isTaskCompleted: (
    taskId: string,
    date: string
  ) => boolean;

  updateTask: (
    taskId: string,
    data: Partial<Task>
  ) => void;

  deleteTask: (
    taskId: string
  ) => void;

  toggleSubtask: (
    taskId: string,
    subtaskIndex: number
  ) => void;

  addSubtask: (
    taskId: string,
    subtask: string
  ) => void;

  deleteSubtask: (
    taskId: string,
    subtaskIndex: number
  ) => void;
};

// =====================================================
// CREATE CONTEXT
// =====================================================

const TaskContext =
  createContext<TaskContextType | undefined>(
    undefined
  );

// =====================================================
// STORAGE KEY
// =====================================================

// New version so the Vercel demo loads the
// updated 7-task default data.
const STORAGE_KEY = '@todo_tasks_v2';

// =====================================================
// DEFAULT 7 TASKS
// =====================================================

const defaultTasks: Task[] = [
  // ---------------------------------------------------
  // 1. Morning walking
  // ---------------------------------------------------

  {
    id: '1',

    title: 'morning walking',

    category: 'Health',

    time: '07:00',

    repeat: 'daily',

    startDate: '2026-10-01',

    endDate: '2026-10-31',

    customDates: [],

    completedDates: [],

    subtasks: [],

    completedSubtasks: [],
  },

  // ---------------------------------------------------
  // 2. Prepare presentation
  // ---------------------------------------------------

  {
    id: '2',

    title:
      'Prepare presentation for team meeting',

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

  // ---------------------------------------------------
  // 3. Doctor appointment
  // ---------------------------------------------------

  {
    id: '3',

    title:
      'schedule doctor appointment',

    category: 'Health',

    time: '10:00',

    repeat: 'once',

    startDate: '2026-10-01',

    endDate: '2026-10-09',

    customDates: [],

    completedDates: [],

    subtasks: [],

    completedSubtasks: [],
  },

  // ---------------------------------------------------
  // 4. Grocery shopping
  // ---------------------------------------------------

  {
    id: '4',

    title: 'grocery shopping',

    category: 'Errands',

    time: '10:30',

    repeat: 'once',

    startDate: '2026-10-01',

    endDate: '2026-10-15',

    customDates: [],

    completedDates: [],

    subtasks: [],

    completedSubtasks: [],
  },

  // ---------------------------------------------------
  // 5. Read Great Gatsby
  // ---------------------------------------------------

  {
    id: '5',

    title:
      "read a chapter of The Great Gatsby",

    category: 'Personal',

    time: '11:00',

    repeat: 'custom',

    startDate: '2026-10-01',

    endDate: '2026-10-31',

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

  // ---------------------------------------------------
  // 6. Respond to emails
  // ---------------------------------------------------

  {
    id: '6',

    title: 'Respond to emails',

    category: 'Work',

    time: '15:00',

    repeat: 'daily',

    startDate: '2026-10-01',

    endDate: '2026-10-30',

    customDates: [],

    completedDates: [],

    subtasks: [],

    completedSubtasks: [],
  },

  // ---------------------------------------------------
  // 7. Review tomorrow task plan
  // ---------------------------------------------------

  {
    id: '7',

    title:
      'review tomorrow task plan',

    category: 'Work',

    time: '18:30',

    repeat: 'daily',

    startDate: '2026-10-01',

    endDate: '2026-10-31',

    customDates: [],

    completedDates: [],

    subtasks: [],

    completedSubtasks: [],
  },
];

// =====================================================
// TASK PROVIDER
// =====================================================

export function TaskProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] =
    useState<Task[]>(defaultTasks);

  const [tasksLoaded, setTasksLoaded] =
    useState(false);

  // ===================================================
  // LOAD SAVED TASKS
  // ===================================================

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );

        if (savedTasks) {
          setTasks(
            JSON.parse(savedTasks)
          );
        }
      } catch (error) {
        console.log(
          'Error loading tasks:',
          error
        );
      } finally {
        setTasksLoaded(true);
      }
    };

    loadTasks();
  }, []);

  // ===================================================
  // SAVE TASKS
  // ===================================================

  useEffect(() => {
    if (!tasksLoaded) {
      return;
    }

    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(tasks)
        );
      } catch (error) {
        console.log(
          'Error saving tasks:',
          error
        );
      }
    };

    saveTasks();
  }, [tasks, tasksLoaded]);

  // ===================================================
  // ADD TASK
  // ===================================================

  const addTask = (task: Task) => {
    setTasks(
      (currentTasks) => [
        ...currentTasks,
        task,
      ]
    );
  };

  // ===================================================
  // TOGGLE TASK
  // ===================================================

  const toggleTask = (
    taskId: string,
    date: string
  ) => {
    setTasks(
      (currentTasks) =>
        currentTasks.map(
          (task) => {
            if (
              task.id !== taskId
            ) {
              return task;
            }

            const alreadyCompleted =
              task.completedDates.includes(
                date
              );

            return {
              ...task,

              completedDates:
                alreadyCompleted
                  ? task.completedDates.filter(
                      (item) =>
                        item !== date
                    )
                  : [
                      ...task.completedDates,
                      date,
                    ],
            };
          }
        )
    );
  };

  // ===================================================
  // CHECK COMPLETED
  // ===================================================

  const isTaskCompleted = (
    taskId: string,
    date: string
  ) => {
    const task = tasks.find(
      (item) =>
        item.id === taskId
    );

    if (!task) {
      return false;
    }

    return task.completedDates.includes(
      date
    );
  };

  // ===================================================
  // UPDATE TASK
  // ===================================================

  const updateTask = (
    taskId: string,
    data: Partial<Task>
  ) => {
    setTasks(
      (currentTasks) =>
        currentTasks.map(
          (task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...data,
                }
              : task
        )
    );
  };

  // ===================================================
  // DELETE TASK
  // ===================================================

  const deleteTask = (
    taskId: string
  ) => {
    setTasks(
      (currentTasks) =>
        currentTasks.filter(
          (task) =>
            task.id !== taskId
        )
    );
  };

  // ===================================================
  // TOGGLE SUBTASK
  // ===================================================

  const toggleSubtask = (
    taskId: string,
    subtaskIndex: number
  ) => {
    setTasks(
      (currentTasks) =>
        currentTasks.map(
          (task) => {
            if (
              task.id !== taskId
            ) {
              return task;
            }

            const updatedCompletedSubtasks =
              [
                ...task.completedSubtasks,
              ];

            updatedCompletedSubtasks[
              subtaskIndex
            ] =
              !updatedCompletedSubtasks[
                subtaskIndex
              ];

            return {
              ...task,

              completedSubtasks:
                updatedCompletedSubtasks,
            };
          }
        )
    );
  };

  // ===================================================
  // ADD SUBTASK
  // ===================================================

  const addSubtask = (
    taskId: string,
    subtask: string
  ) => {
    const cleanSubtask =
      subtask.trim();

    if (!cleanSubtask) {
      return;
    }

    setTasks(
      (currentTasks) =>
        currentTasks.map(
          (task) => {
            if (
              task.id !== taskId
            ) {
              return task;
            }

            return {
              ...task,

              subtasks: [
                ...task.subtasks,
                cleanSubtask,
              ],

              completedSubtasks: [
                ...task.completedSubtasks,
                false,
              ],
            };
          }
        )
    );
  };

  // ===================================================
  // DELETE SUBTASK
  // ===================================================

  const deleteSubtask = (
    taskId: string,
    subtaskIndex: number
  ) => {
    setTasks(
      (currentTasks) =>
        currentTasks.map(
          (task) => {
            if (
              task.id !== taskId
            ) {
              return task;
            }

            return {
              ...task,

              subtasks:
                task.subtasks.filter(
                  (_, index) =>
                    index !==
                    subtaskIndex
                ),

              completedSubtasks:
                task.completedSubtasks.filter(
                  (_, index) =>
                    index !==
                    subtaskIndex
                ),
            };
          }
        )
    );
  };

  // ===================================================
  // PROVIDER
  // ===================================================

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

// =====================================================
// USE TASKS HOOK
// =====================================================

export function useTasks() {
  const context =
    useContext(TaskContext);

  if (!context) {
    throw new Error(
      'useTasks must be used inside TaskProvider'
    );
  }

  return context;
}