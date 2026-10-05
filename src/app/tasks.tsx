import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useRouter, useFocusEffect } from 'expo-router';

import { useTheme } from '../context/ThemeContext';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';

import {
  useTasks,
  Task,
} from '../context/TaskContext';


// =====================================================
// TODAY
// =====================================================

const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


// =====================================================
// PERIOD
// =====================================================

const getPeriod = (
  time: string
): 'Morning' | 'Afternoon' | 'Evening' => {
  const hour = Number(
    time.split(':')[0]
  );

  if (hour < 12) {
    return 'Morning';
  }

  if (hour < 17) {
    return 'Afternoon';
  }

  return 'Evening';
};


// =====================================================
// GREETING
// =====================================================

const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 17) {
    return 'Good afternoon';
  }

  return 'Good evening';
};


// =====================================================
// CATEGORY ICON
// =====================================================

const getCategoryIcon = (
  category: string
) => {
  if (category === 'Work') {
    return '💼';
  }

  if (category === 'Personal') {
    return '🌸';
  }

  if (category === 'Errands') {
    return '🛒';
  }

  if (category === 'Health') {
    return '💪';
  }

  if (category === 'Study') {
    return '📚';
  }

  if (category === 'Home') {
    return '🏠';
  }

  return '📌';
};


// =====================================================
// DATE FORMAT
// =====================================================

const formatDate = (date: string) => {
  const parts = date.split('-');

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const formatDateRange = (
  startDate: string,
  endDate: string
) => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (startDate === endDate) {
    return start;
  }

  return `${start} → ${end}`;
};

const formatTodayLabel = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);

  if (!year || !month || !day) {
    return date;
  }

  const currentDate = new Date(year, month - 1, day);

  return currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

// =====================================================
// TASK SCREEN
// =====================================================

export default function TasksScreen() {
  const router = useRouter();

  const { colors } = useTheme();

  const [today, setToday] = useState(() => getTodayDate());

  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

     
      const newToday = getTodayDate();
      setToday((previousToday) =>
        previousToday === newToday
          ? previousToday
          : newToday
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const {
    tasks,
    toggleTask,
    isTaskCompleted,
    updateTask,
    deleteTask,
  } = useTasks();


  // ===================================================
  // SELECTED TASK
  // ===================================================

  const [
    selectedTask,
    setSelectedTask,
  ] = useState<Task | null>(null);


  // ===================================================
  // NEW SUBTASK
  // ===================================================

  const [
    newSubtask,
    setNewSubtask,
  ] = useState('');


  // ===================================================
  // TODAY TASKS
  // ===================================================

  const todayTasks = useMemo(() => {
    return tasks.filter((task) => {

      // ONE TIME TASK
      if (
        task.repeat === 'once'
      ) {
        return (
          today >= task.startDate &&
          today <= task.endDate
        );
      }

      // DAILY TASK
      if (
        task.repeat === 'daily'
      ) {
        return (
          today >= task.startDate &&
          today <= task.endDate
        );
      }

      // WEEKDAYS
      if (
        task.repeat === 'weekdays'
      ) {
        const day =
          new Date(
            `${today}T00:00:00`
          ).getDay();

        return (
          day !== 0 &&
          day !== 6 &&
          today >= task.startDate &&
          today <= task.endDate
        );
      }

      // CUSTOM DATES
      if (
        task.repeat === 'custom'
      ) {
        return task.customDates.includes(
          today
        );
      }

      return false;
    });
  }, [tasks, today]);


  // ===================================================
  // COMPLETED COUNT
  // ===================================================

  const completedCount =
    todayTasks.filter((task) =>
      isTaskCompleted(
        task.id,
        today
      )
    ).length;


  const totalCount =
    todayTasks.length;


  const progress =
    totalCount === 0
      ? 0
      : Math.round(
          (completedCount /
            totalCount) *
            100
        );


  // ===================================================
  // PERIOD TASKS
  // ===================================================

  const morningTasks =
    todayTasks.filter(
      (task) =>
        getPeriod(task.time) ===
        'Morning'
    );


  const afternoonTasks =
    todayTasks.filter(
      (task) =>
        getPeriod(task.time) ===
        'Afternoon'
    );


  const eveningTasks =
    todayTasks.filter(
      (task) =>
        getPeriod(task.time) ===
        'Evening'
    );

const [userName, setUserName] = useState('devika');

useFocusEffect(
  React.useCallback(() => {
    const loadUserName = async () => {
      try {
        const savedName = await AsyncStorage.getItem('@todo_user_name');
        setUserName(savedName?.trim() || 'devika');
      } catch (error) {
        console.log('Failed to load user name', error);
      }
    };

    loadUserName();
  }, [])
);
  // ===================================================
  // OPEN TASK DETAILS
  // ===================================================

  const openTaskDetails = (
    task: Task
  ) => {
    setSelectedTask({
      ...task,

      subtasks: [
        ...task.subtasks,
      ],

      completedSubtasks: [
        ...task.completedSubtasks,
      ],
      
    });

    setNewSubtask('');
  };


  // ===================================================
  // ADD SUBTASK
  // ===================================================

  const addSubtask = () => {

    if (!selectedTask) {
      return;
    }

    if (
      newSubtask.trim() === ''
    ) {
      return;
    }

    const updatedTask: Task = {
      ...selectedTask,

      subtasks: [
        ...selectedTask.subtasks,
        newSubtask.trim(),
      ],

      completedSubtasks: [
        ...selectedTask.completedSubtasks,
        false,
      ],
    };

    setSelectedTask(
      updatedTask
    );

    setNewSubtask('');
  };


  // ===================================================
  // TOGGLE SUBTASK
  // ===================================================

  const toggleSubtask = (
    index: number
  ) => {

    if (!selectedTask) {
      return;
    }

    const completed = [
      ...selectedTask.completedSubtasks,
    ];

    completed[index] =
      !completed[index];

    setSelectedTask({
      ...selectedTask,

      completedSubtasks:
        completed,
    });
  };


  // ===================================================
  // COMPLETE TASK
  // ===================================================

  const markTaskComplete = () => {

    if (!selectedTask) {
      return;
    }


    // If subtasks exist,
    // all subtasks must be completed.

    if (
      selectedTask.subtasks.length >
      0
    ) {

      const allCompleted =
        selectedTask.completedSubtasks
          .length ===
          selectedTask.subtasks.length &&
        selectedTask.completedSubtasks.every(
          (item) =>
            item === true
        );

      if (!allCompleted) {
        return;
      }
    }


    // Save subtasks

    updateTask(
      selectedTask.id,
      {
        subtasks:
          selectedTask.subtasks,

        completedSubtasks:
          selectedTask.completedSubtasks,
      }
    );


    // Complete today's task

    toggleTask(
      selectedTask.id,
      today
    );


    setSelectedTask(null);

    setNewSubtask('');
  };


  // ===================================================
  // DELETE TASK
  // ===================================================

  const handleDeleteTask = () => {

    if (!selectedTask) {
      return;
    }

    deleteTask(
      selectedTask.id
    );

    setSelectedTask(null);

    setNewSubtask('');
  };


  // ===================================================
  // EDIT TASK
  // ===================================================

  const handleEditTask = () => {
    if (!selectedTask) {
      return;
    }

    const taskToEdit = selectedTask;

    setSelectedTask(null);
    setNewSubtask('');

    router.navigate({
      pathname: '/add-task',
      params: {
        editId: taskToEdit.id,
        title: taskToEdit.title,
        category: taskToEdit.category,
        time: taskToEdit.time,
        startDate: taskToEdit.startDate,
        endDate: taskToEdit.endDate,
        repeat: taskToEdit.repeat,
        subtasks: JSON.stringify(taskToEdit.subtasks),
      },
    });
  };


  // ===================================================
  // TASK CARD
  // ===================================================

  const renderTask = (
    task: Task
  ) => {

    const completed =
      isTaskCompleted(
        task.id,
        today
      );

    return (
      <Pressable
        key={task.id}
        style={[
          styles.taskCard,

          completed &&
            styles.completedTaskCard,
        ]}
        onPress={() =>
          openTaskDetails(task)
        }
      >

        {/* CHECK CIRCLE */}

        <View
          style={[
            styles.taskCircle,

            completed &&
              styles.taskCircleCompleted,
          ]}
        >

          {completed && (
            <Text
              style={styles.checkMark}
            >
              ✓
            </Text>
          )}

        </View>


        {/* TASK INFO */}

        <View
          style={styles.taskInfo}
        >

          <Text
            style={[
              styles.taskTitle,

              completed &&
                styles.completedTaskTitle,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>


          <Text
            style={styles.taskMeta}
          >
            {getCategoryIcon(
              task.category
            )}{' '}
            {task.category}
            {'  •  '}
            📅 {formatDateRange(
              task.startDate,
              task.endDate
            )}
            {'  •  '}
            🕘 {task.time}
          </Text>

        </View>


        {/* ARROW */}

        <Text
          style={styles.taskArrow}
        >
          ›
        </Text>

      </Pressable>
    );
  };


  // ===================================================
  // SECTION
  // ===================================================

  const renderSection = (
    title: string,
    taskList: Task[],
    dotStyle: object
  ) => {

    if (
      taskList.length === 0
    ) {
      return null;
    }

    return (
      <View>

        <View
          style={styles.sectionHeader}
        >

          <View
            style={[
              styles.sectionDot,
              dotStyle,
            ]}
          />

          <Text
            style={styles.sectionTitle}
          >
            {title}
          </Text>

        </View>

        {taskList.map(
          renderTask
        )}

      </View>
    );
  };


  // ===================================================
  // RETURN
  // ===================================================

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  return (
    <SafeAreaView
      style={styles.screen}
    >

      {/* ==========================================
          STATUS BAR
      ========================================== */}

      <View
        style={styles.statusBar}
      >

        <Text
          style={styles.statusTime}
        >
          {currentTime}
        </Text>


        <View
          style={styles.statusIcons}
        >

          <View
            style={styles.signal}
          >

            <View
              style={[
                styles.signalBar,
                { height: 3 },
              ]}
            />

            <View
              style={[
                styles.signalBar,
                { height: 5 },
              ]}
            />

            <View
              style={[
                styles.signalBar,
                { height: 7 },
              ]}
            />

            <View
              style={[
                styles.signalBar,
                { height: 9 },
              ]}
            />

          </View>


          <View
            style={styles.wifi}
          >
            <View
              style={styles.wifiOuter}
            />

            <View
              style={styles.wifiMiddle}
            />

            <View
              style={styles.wifiDot}
            />
          </View>


          <View
            style={styles.battery}
          >

            <View
              style={styles.batteryFill}
            />

            <View
              style={styles.batteryTip}
            />

          </View>

        </View>

      </View>


      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >

        {/* DATE */}

        <Text
          style={styles.dateText}
        >
          {formatTodayLabel(today)}
        </Text>


        {/* GREETING */}

        <Text
          style={styles.greeting}
        >
          {getGreeting()}, {userName}
        </Text>


        {/* ========================================
            PROGRESS CARD
        ======================================== */}

        <View
          style={styles.progressCard}
        >

          <View
            style={
              styles.progressCircleOuter
            }
          >

            <View
              style={
                styles.progressCircleInner
              }
            >

              <Text
                style={
                  styles.progressNumber
                }
              >
                {progress}%
              </Text>

            </View>

          </View>


          <View>

            <Text
              style={
                styles.progressTitle
              }
            >
              {completedCount} of{' '}
              {totalCount} tasks done
            </Text>

            <Text
              style={
                styles.progressSubtitle
              }
            >
              One task at a time
            </Text>

          </View>

        </View>


        {/* ========================================
            MORNING
        ======================================== */}

        {renderSection(
          'Morning',
          morningTasks,
          styles.morningDot
        )}


        {/* ========================================
            AFTERNOON
        ======================================== */}

        {renderSection(
          'Afternoon',
          afternoonTasks,
          styles.afternoonDot
        )}


        {/* ========================================
            EVENING
        ======================================== */}

        {renderSection(
          'Evening',
          eveningTasks,
          styles.eveningDot
        )}


        <View
          style={styles.bottomSpace}
        />

      </ScrollView>


      {/* ==========================================
          FLOATING +
      ========================================== */}

      <Pressable
        style={
          styles.floatingButton
        }
        onPress={() =>
          router.navigate(
            '/add-task'
          )
        }
      >

        <Text
          style={styles.floatingPlus}
        >
          +
        </Text>

      </Pressable>


      {/* ==========================================
          BOTTOM NAVIGATION
      ========================================== */}

      <View
        style={
          styles.bottomNavigation
        }
      >

        <Pressable
          style={styles.navItem}
        >

          <Text
            style={styles.navIcon}
          >
            🏠
          </Text>

          <Text
            style={
              styles.activeNavText
            }
          >
            Today
          </Text>

        </Pressable>


        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.navigate(
              '/calendar'
            )
          }
        >

          <Text
            style={styles.navIcon}
          >
            ▦
          </Text>

          <Text
            style={styles.navText}
          >
            Calendar
          </Text>

        </Pressable>


        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.navigate(
              '/stats'
            )
          }
        >

          <Text
            style={styles.navIcon}
          >
            📊
          </Text>

          <Text
            style={styles.navText}
          >
            Stats
          </Text>

        </Pressable>


        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.navigate(
              '/profile'
            )
          }
        >

          <Text
            style={styles.navIcon}
          >
            👤
          </Text>

          <Text
            style={styles.navText}
          >
            Profile
          </Text>

        </Pressable>

      </View>


      {/* =====================================================
          TASK DETAILS POPUP
      ===================================================== */}

      {selectedTask && (

        <View
          style={
            styles.modalOverlay
          }
        >

          <View
            style={
              styles.taskDetailsSheet
            }
          >

            {/* DRAG HANDLE */}

            <View
              style={styles.dragHandle}
            />


            {/* HEADER */}

            <View
              style={styles.modalHeader}
            >

              <Text
                style={styles.modalTitle}
              >
                Task details
              </Text>


              <Pressable
                style={
                  styles.closeButton
                }
                onPress={() => {
                  setSelectedTask(
                    null
                  );

                  setNewSubtask('');
                }}
              >

                <Text
                  style={styles.closeText}
                >
                  ×
                </Text>

              </Pressable>

            </View>


            {/* MAIN TASK CARD */}

            <View
              style={styles.mainTaskCard}
            >

              <View
                style={[
                  styles.modalTaskCircle,

                  isTaskCompleted(
                    selectedTask.id,
                    today
                  ) &&
                    styles.modalTaskCircleDone,
                ]}
              >

                {isTaskCompleted(
                  selectedTask.id,
                  today
                ) && (

                  <Text
                    style={
                      styles.checkMark
                    }
                  >
                    ✓
                  </Text>

                )}

              </View>


              <View
                style={styles.modalTaskInfo}
              >

                <Text
                  style={
                    styles.modalTaskTitle
                  }
                >
                  {selectedTask.title}
                </Text>


                <Text
                  style={
                    styles.modalTaskMeta
                  }
                >
                  {getCategoryIcon(
                    selectedTask.category
                  )}{' '}
                  {selectedTask.category}
                  {'  •  '}
                  📅 {formatDateRange(
                    selectedTask.startDate,
                    selectedTask.endDate
                  )}
                  {'  •  '}
                  🕘 {selectedTask.time}
                </Text>

              </View>

            </View>


            {/* SUBTASK SECTION */}

            <View
              style={styles.subtaskCard}
            >

              <View
                style={
                  styles.subtaskHeader
                }
              >

                <Text
                  style={
                    styles.subtaskTitle
                  }
                >
                  Subtasks
                </Text>


                <Text
                  style={
                    styles.subtaskCount
                  }
                >
                  {
                    selectedTask
                      .completedSubtasks
                      .filter(Boolean)
                      .length
                  }
                  /
                  {
                    selectedTask
                      .subtasks.length
                  }{' '}
                  completed
                </Text>

              </View>


              {/* EXISTING SUBTASKS */}

              {selectedTask.subtasks.map(
                (
                  item,
                  index
                ) => {

                  const checked =
                    selectedTask
                      .completedSubtasks[
                      index
                    ];

                  return (
                    <Pressable
                      key={`${item}-${index}`}
                      style={
                        styles.subtaskItem
                      }
                      onPress={() =>
                        toggleSubtask(
                          index
                        )
                      }
                    >

                      <View
                        style={[
                          styles.subtaskCircle,

                          checked &&
                            styles.subtaskCircleChecked,
                        ]}
                      >

                        {checked && (
                          <Text
                            style={
                              styles.subtaskCheck
                            }
                          >
                            ✓
                          </Text>
                        )}

                      </View>


                      <Text
                        style={[
                          styles.subtaskText,

                          checked &&
                            styles.subtaskTextDone,
                        ]}
                      >
                        {item}
                      </Text>

                    </Pressable>
                  );
                }
              )}


              {/* ADD SUBTASK */}

              <View
                style={
                  styles.addSubtaskRow
                }
              >

                <View
                  style={
                    styles.addSubtaskIcon
                  }
                >

                  <Text
                    style={
                      styles.addSubtaskPlus
                    }
                  >
                    +
                  </Text>

                </View>


                <TextInput
                  style={
                    styles.subtaskInput
                  }
                  placeholder="Add a subtask..."
                  placeholderTextColor="#7183A0"
                  value={newSubtask}
                  onChangeText={
                    setNewSubtask
                  }
                  onSubmitEditing={
                    addSubtask
                  }
                  returnKeyType="done"
                />


                <Pressable
                  style={
                    styles.smallAddButton
                  }
                  onPress={
                    addSubtask
                  }
                >

                  <Text
                    style={
                      styles.smallAddText
                    }
                  >
                    Add
                  </Text>

                </Pressable>

              </View>

            </View>


            {/* ACTIONS */}

            <View
              style={styles.actionRow}
            >

              {/* EDIT */}

              <Pressable
                style={styles.editButton}
                onPress={handleEditTask}
              >
                <Text style={styles.editIcon}>
                  ✏️
                </Text>

                <Text style={styles.editText}>
                  Edit
                </Text>
              </Pressable>


              {/* DELETE */}

              <Pressable
                style={
                  styles.deleteButton
                }
                onPress={
                  handleDeleteTask
                }
              >

                <Text
                  style={
                    styles.deleteIcon
                  }
                >
                  🗑
                </Text>

                <Text
                  style={
                    styles.deleteText
                  }
                >
                  Delete
                </Text>

              </Pressable>


              {/* CANCEL */}

              <Pressable
                style={
                  styles.cancelButton
                }
                onPress={() => {
                  setSelectedTask(
                    null
                  );

                  setNewSubtask('');
                }}
              >

                <Text
                  style={
                    styles.cancelText
                  }
                >
                  Cancel
                </Text>

              </Pressable>


              {/* COMPLETE */}

              <Pressable
                style={[
                  styles.completeButton,

                  selectedTask
                    .subtasks
                    .length > 0 &&

                    !selectedTask
                      .completedSubtasks
                      .every(
                        Boolean
                      ) &&

                    styles.completeButtonDisabled,
                ]}
                onPress={
                  markTaskComplete
                }
              >

                <Text
                  style={
                    styles.completeText
                  }
                >
                  ✓ Mark as complete
                </Text>

              </Pressable>

            </View>

          </View>

        </View>

      )}

    </SafeAreaView>
  );
}


// =====================================================
// STYLES
// =====================================================

const createStyles = (colors: any) =>
  StyleSheet.create({

    screen: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    // STATUS

    statusBar: {
      height: 28,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      paddingHorizontal: 14,
    },

    statusTime: {
      color: colors.text,
      fontSize: 11,
      fontWeight: '600',
    },

    statusIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    signal: {
      width: 12,
      height: 10,
      flexDirection: 'row',
      alignItems:
        'flex-end',
      gap: 1,
    },

    signalBar: {
      width: 2,
      backgroundColor:
        colors.text,
      borderRadius: 1,
    },

    wifi: {
      width: 15,
      height: 15,
      position: 'relative',
    },

    wifiOuter: {
      position: 'absolute',
      width: 13,
      height: 8,
      borderTopWidth: 1.5,
      borderColor: colors.text,
      borderRadius: 10,
      top: 1,
      left: 1,
    },

    wifiMiddle: {
      position: 'absolute',
      width: 8,
      height: 5,
      borderTopWidth: 1.5,
      borderColor: colors.text,
      borderRadius: 8,
      left: 3.5,
      top: 4,
    },

    wifiDot: {
      position: 'absolute',
      width: 3,
      height: 3,
      borderRadius: 2,
      backgroundColor:
        colors.text,
      left: 6,
      bottom: 0,
    },

    battery: {
      width: 16,
      height: 8,
      borderWidth: 1,
      borderColor: colors.text,
      borderRadius: 2,
      padding: 1,
      position: 'relative',
    },

    batteryFill: {
      flex: 1,
      backgroundColor:
        colors.text,
      borderRadius: 1,
    },

    batteryTip: {
      position: 'absolute',
      right: -3,
      top: 2,
      width: 2,
      height: 4,
      backgroundColor:
        colors.text,
    },


    // MAIN

    scroll: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 18,
      paddingTop: 5,
    },

    dateText: {
      color: '#126EED',
      fontSize: 12,
      marginBottom: 3,
    },

    greeting: {
      color: colors.text,
      fontSize: 25,
      fontWeight: '700',
      marginBottom: 16,
    },


    // PROGRESS

    progressCard: {
      height: 120,
      borderRadius: 20,
      backgroundColor:
        '#FFD84D',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      marginBottom: 20,
    },

    progressCircleOuter: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor:
        '#FFF0A8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 18,
    },

    progressCircleInner: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor:
        colors.text,
      alignItems: 'center',
      justifyContent: 'center',
    },

    progressNumber: {
      color: '#15233B',
      fontSize: 18,
      fontWeight: '700',
    },

    progressTitle: {
      color: '#15233B',
      fontSize: 18,
      fontWeight: '700',
    },

    progressSubtitle: {
      color: '#126EED',
      fontSize: 15,
      marginTop: 5,
    },


    // SECTION

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 9,
      marginTop: 2,
    },

    sectionDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 7,
    },

    morningDot: {
      backgroundColor:
        '#FF9D3D',
    },

    afternoonDot: {
      backgroundColor:
        '#FFD21C',
    },

    eveningDot: {
      backgroundColor:
        '#AA65E5',
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },


    // TASK

    taskCard: {
      minHeight: 65,
      backgroundColor:
        colors.card,
      borderWidth: 1,
      borderColor:
        '#2A3C59',
      borderRadius: 14,
      marginBottom: 9,
      paddingHorizontal: 11,
      flexDirection: 'row',
      alignItems: 'center',
    },

    completedTaskCard: {
      opacity: 0.65,
    },

    taskCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor:
        '#2DD4D8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 11,
    },

    taskCircleCompleted: {
      backgroundColor:
        '#35C0C4',
      borderColor:
        '#35C0C4',
    },

    checkMark: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },

    taskInfo: {
      flex: 1,
    },

    taskTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
    },

    completedTaskTitle: {
      textDecorationLine:
        'line-through',
    },

    taskMeta: {
      color: '#7F96B6',
      fontSize: 11,
      marginTop: 3,
    },

    taskArrow: {
      color: '#6C86A7',
      fontSize: 29,
      marginLeft: 7,
    },

    bottomSpace: {
      height: 100,
    },


    // FLOATING +

    floatingButton: {
      position: 'absolute',
      right: 18,
      bottom: 70,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor:
        '#39C4C8',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 7,
    },

    floatingPlus: {
      color: colors.text,
      fontSize: 30,
      fontWeight: '300',
    },


    // NAV

    bottomNavigation: {
      height: 58,
      backgroundColor:
        colors.card,
      borderTopWidth: 1,
      borderTopColor:
        colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-around',
    },

    navItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    navIcon: {
      fontSize: 18,
      marginBottom: 2,
    },

    navText: {
      fontSize: 12,
      color: '#7184A2',
    },

    activeNavText: {
      fontSize: 12,
      color: colors.accentStrong,
      fontWeight: '700',
    },


    // MODAL

    modalOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor:
        'rgba(3, 9, 20, 0.72)',
      justifyContent: 'flex-end',
    },

    taskDetailsSheet: {
      backgroundColor:
        colors.cardAlt,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      borderWidth: 1,
      borderColor:
        '#2B4162',
      paddingHorizontal: 16,
      paddingTop: 9,
      paddingBottom: 18,
      maxHeight: '88%',
    },

    dragHandle: {
      width: 68,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        '#8094B3',
      alignSelf: 'center',
      marginBottom: 12,
    },

    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 14,
    },

    modalTitle: {
      color: colors.text,
      fontSize: 23,
      fontWeight: '700',
    },

    closeButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor:
        '#203554',
      alignItems: 'center',
      justifyContent: 'center',
    },

    closeText: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '300',
      lineHeight: 28,
    },


    // MAIN TASK CARD

    mainTaskCard: {
      backgroundColor:
        '#192D4A',
      borderWidth: 1,
      borderColor:
        '#2C4362',
      borderRadius: 17,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },

    modalTaskCircle: {
      width: 43,
      height: 43,
      borderRadius: 22,
      borderWidth: 3,
      borderColor:
        '#32CDD0',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    modalTaskCircleDone: {
      backgroundColor:
        '#32CDD0',
    },

    modalTaskInfo: {
      flex: 1,
    },

    modalTaskTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 19,
    },

    modalTaskMeta: {
      color: '#A2B2C9',
      fontSize: 9,
      marginTop: 6,
    },


    // SUBTASK

    subtaskCard: {
      backgroundColor:
        '#192D4A',
      borderWidth: 1,
      borderColor:
        '#2C4362',
      borderRadius: 17,
      padding: 14,
      marginBottom: 14,
    },

    subtaskHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 11,
    },

    subtaskTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
    },

    subtaskCount: {
      color: '#A8B8CE',
      fontSize: 12,
    },

    subtaskItem: {
      minHeight: 47,
      borderWidth: 1,
      borderColor:
        '#334A6B',
      borderRadius: 13,
      paddingHorizontal: 11,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },

    subtaskCircle: {
      width: 25,
      height: 25,
      borderRadius: 13,
      borderWidth: 2,
      borderColor:
        '#7489A8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 11,
    },

    subtaskCircleChecked: {
      backgroundColor:
        colors.accentStrong,
      borderColor:
        colors.accentStrong,
    },

    subtaskCheck: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },

    subtaskText: {
      flex: 1,
      color: colors.text,
      fontSize: 12,
    },

    subtaskTextDone: {
      color: '#71819A',
      textDecorationLine:
        'line-through',
    },

    addSubtaskRow: {
      minHeight: 47,
      borderWidth: 1,
      borderColor:
        '#334A6B',
      borderRadius: 13,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 9,
    },

    addSubtaskIcon: {
      width: 25,
      height: 25,
      borderRadius: 13,
      backgroundColor:
        '#263C5B',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 9,
    },

    addSubtaskPlus: {
      color: colors.text,
      fontSize: 19,
    },

    subtaskInput: {
      flex: 1,
      height: 40,
      color: colors.text,
      fontSize: 11,
    },

    smallAddButton: {
      backgroundColor:
        colors.accentStrong,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },

    smallAddText: {
      color: colors.text,
      fontSize: 9,
      fontWeight: '700',
    },


    // ACTIONS

    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    editButton: {
      height: 47,
      width: 70,
      borderRadius: 12,
      backgroundColor: '#3478F6',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    editIcon: {
      fontSize: 13,
      marginRight: 3,
    },

    editText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '700',
    },

    deleteButton: {
      height: 47,
      width: 82,
      borderRadius: 12,
      backgroundColor:
        colors.danger,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    deleteIcon: {
      fontSize: 15,
      marginRight: 4,
    },

    deleteText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '700',
    },

    cancelButton: {
      height: 47,
      width: 82,
      borderRadius: 12,
      backgroundColor:
        '#253A59',
      alignItems: 'center',
      justifyContent: 'center',
    },

    cancelText: {
      color: '#C2CDDC',
      fontSize: 13,
      fontWeight: '700',
    },

    completeButton: {
      flex: 1,
      height: 47,
      borderRadius: 12,
      backgroundColor:
        colors.accentStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },

    completeButtonDisabled: {
      backgroundColor:
        '#38546F',
    },

    completeText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '700',
    },

  });