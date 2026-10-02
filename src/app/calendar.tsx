import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'expo-router';

import { useTheme } from '../context/ThemeContext';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';

import { useTasks, Task } from '../context/TaskContext';


// ======================================================
// HELPERS
// ======================================================

const categoryEmoji: Record<string, string> = {
  Health: '💪',
  Work: '💼',
  Study: '📚',
  Home: '🏠',
  Personal: '🌸',
  Errands: '🛒',
};


// Convert Date -> YYYY-MM-DD
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


// Parse YYYY-MM-DD safely
const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
};


// Check whether task should appear on selected date
const isTaskForDate = (
  task: Task,
  selectedDate: string
) => {
  const selected = parseDate(selectedDate);
  const start = parseDate(task.startDate);
  const end = parseDate(task.endDate);

  if (selected < start || selected > end) {
    return false;
  }

  if (task.repeat === 'custom') {
    return task.customDates.includes(selectedDate);
  }

  return true;
};


// ======================================================
// COMPONENT
// ======================================================

export default function CalendarScreen() {
  const router = useRouter();

  const { colors } = useTheme();
  const [currentTime, setCurrentTime] =
  useState(new Date());

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);

  const {
    tasks,
    toggleTask,
    isTaskCompleted,
  } = useTasks();


  // Current calendar month
  const initialDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      1
    )
  );

  // Selected date
  const [selectedDate, setSelectedDate] = useState(
    formatDate(initialDate)
  );


  // ======================================================
  // MONTH DETAILS
  // ======================================================

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleString(
    'en-US',
    {
      month: 'long',
    }
  );


  // First day of month
  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();


  // Number of days
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();


  // ======================================================
  // CALENDAR DATES
  // ======================================================

  const calendarDates = useMemo(() => {
    const dates: (number | null)[] = [];

    // Empty cells before first date
    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    // Actual dates
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(day);
    }

    return dates;
  }, [firstDay, daysInMonth]);


  // ======================================================
  // CHANGE MONTH
  // ======================================================

  const goPreviousMonth = () => {
    const newMonth = new Date(
      year,
      month - 1,
      1
    );

    setCurrentMonth(newMonth);

    const firstDate = new Date(
      newMonth.getFullYear(),
      newMonth.getMonth(),
      1
    );

    setSelectedDate(formatDate(firstDate));
  };


  const goNextMonth = () => {
    const newMonth = new Date(
      year,
      month + 1,
      1
    );

    setCurrentMonth(newMonth);

    const firstDate = new Date(
      newMonth.getFullYear(),
      newMonth.getMonth(),
      1
    );

    setSelectedDate(formatDate(firstDate));
  };


  // ======================================================
  // GET DATE STRING
  // ======================================================

  const getDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(
      2,
      '0'
    )}-${String(day).padStart(2, '0')}`;
  };


  // ======================================================
  // CHECK TASK EXISTS ON DATE
  // ======================================================

  const hasTaskOnDate = (date: string) => {
    return tasks.some((task) =>
      isTaskForDate(task, date)
    );
  };


  // ======================================================
  // SELECTED DATE TASKS
  // ======================================================

  const selectedTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        isTaskForDate(task, selectedDate)
      )
      .sort((a, b) =>
        a.time.localeCompare(b.time)
      );
  }, [tasks, selectedDate]);


  // ======================================================
  // OPEN TASK DETAILS
  // ======================================================

  const openTaskDetails = (task: Task) => {
    router.navigate({
      pathname: '/task-details',
      params: {
        id: task.id,
        title: task.title,
        category: task.category,
        time: task.time,
        startDate: task.startDate,
        endDate: task.endDate,
        subtasks: JSON.stringify(
          task.subtasks || []
        ),
      },
    });
  };


  // ======================================================
  // TASK SECTION
  // ======================================================

  const renderSection = (
    title: string,
    sectionTasks: Task[],
    dotColor: string
  ) => {
    if (sectionTasks.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>

        {/* SECTION HEADER */}

        <View style={styles.sectionHeader}>

          <View
            style={[
              styles.sectionDot,
              {
                backgroundColor: dotColor,
              },
            ]}
          />

          <Text style={styles.sectionTitle}>
            {title}
          </Text>

        </View>


        {/* TASKS */}

        {sectionTasks.map((task) => {

          const completed =
            isTaskCompleted(
              task.id,
              selectedDate
            );

          return (
            <Pressable
              key={task.id}
              style={styles.taskCard}
              onPress={() =>
                openTaskDetails(task)
              }
            >

              {/* CHECKBOX */}

              <Pressable
                style={[
                  styles.checkbox,
                  completed &&
                    styles.checkboxCompleted,
                ]}
                onPress={(event) => {
                  event.stopPropagation();

                  toggleTask(
                    task.id,
                    selectedDate
                  );
                }}
              >

                {completed && (
                  <Text
                    style={
                      styles.checkMark
                    }
                  >
                    ✓
                  </Text>
                )}

              </Pressable>


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
                  {categoryEmoji[
                    task.category
                  ] || '📌'}{' '}
                  {task.category} •{' '}
                  {task.time}
                </Text>


                {/* DATE RANGE */}

                {task.startDate !==
                  task.endDate && (
                  <Text
                    style={
                      styles.taskDate
                    }
                  >
                    📅 {task.startDate} →{' '}
                    {task.endDate}
                  </Text>
                )}

              </View>


              {/* ARROW */}

              <Text
                style={styles.arrowRight}
              >
                ›
              </Text>

            </Pressable>
          );
        })}

      </View>
    );
  };


  // ======================================================
  // UI
  // ======================================================

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  return (
    <SafeAreaView style={styles.screen}>

      {/* ==================================================
          STATUS BAR
      ================================================== */}

      <View style={styles.statusBar}>

      <Text style={styles.statusTime}>
  {currentTime.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}
</Text>

        <View style={styles.statusRight}>

          {/* SIGNAL */}

          <View style={styles.signal}>

            <View
              style={[
                styles.bar,
                { height: 3 },
              ]}
            />

            <View
              style={[
                styles.bar,
                { height: 5 },
              ]}
            />

            <View
              style={[
                styles.bar,
                { height: 7 },
              ]}
            />

            <View
              style={[
                styles.bar,
                { height: 9 },
              ]}
            />

          </View>


          {/* WIFI */}

          <View style={styles.wifi}>

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


          {/* BATTERY */}

          <View style={styles.battery}>

            <View
              style={styles.batteryFill}
            />

            <View
              style={styles.batteryTip}
            />

          </View>

        </View>

      </View>


      {/* ==================================================
          MAIN SCROLL
      ================================================== */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* TITLE */}

        <Text style={styles.pageTitle}>
          Calendar
        </Text>


        {/* ==================================================
            CALENDAR CARD
        ================================================== */}

        <View
          style={styles.calendarCard}
        >

          {/* MONTH HEADER */}

          <View
            style={styles.monthHeader}
          >

            <Pressable
              onPress={
                goPreviousMonth
              }
              style={styles.monthArrowButton}
            >
              <Text
                style={styles.arrow}
              >
                ‹
              </Text>
            </Pressable>


            <Text
              style={styles.monthTitle}
            >
              {monthName} {year}
            </Text>


            <Pressable
              onPress={
                goNextMonth
              }
              style={styles.monthArrowButton}
            >
              <Text
                style={styles.arrow}
              >
                ›
              </Text>
            </Pressable>

          </View>


          {/* WEEK DAYS */}

          <View
            style={styles.weekRow}
          >

            {[
              'S',
              'M',
              'T',
              'W',
              'T',
              'F',
              'S',
            ].map(
              (day, index) => (
                <Text
                  key={index}
                  style={
                    styles.weekDay
                  }
                >
                  {day}
                </Text>
              )
            )}

          </View>


          {/* DATES */}

          <View
            style={styles.calendarGrid}
          >

            {calendarDates.map(
              (date, index) => {

                // Empty cell

                if (
                  date === null
                ) {
                  return (
                    <View
                      key={index}
                      style={
                        styles.dateCell
                      }
                    />
                  );
                }


                const dateString =
                  getDateString(
                    date
                  );

                const selected =
                  dateString ===
                  selectedDate;

                const hasTask =
                  hasTaskOnDate(
                    dateString
                  );


                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.dateCell,
                      selected &&
                        styles.selectedDate,
                    ]}
                    onPress={() =>
                      setSelectedDate(
                        dateString
                      )
                    }
                  >

                    <Text
                      style={[
                        styles.dateText,
                        selected &&
                          styles.selectedDateText,
                      ]}
                    >
                      {date}
                    </Text>


                    {/* TASK DOT */}

                    {hasTask && (
                      <View
                        style={[
                          styles.taskDot,
                          selected &&
                            styles.selectedTaskDot,
                        ]}
                      />
                    )}

                  </Pressable>
                );
              }
            )}

          </View>

        </View>


        {/* ==================================================
            SELECTED DATE
        ================================================== */}

        <Text
          style={styles.tasksDate}
        >
          Tasks on {selectedDate}
        </Text>


        {/* ==================================================
            NO TASK
        ================================================== */}

        {selectedTasks.length === 0 && (
          <View
            style={styles.emptyBox}
          >

            <Text
              style={styles.emptyIcon}
            >
              📅
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              No tasks for this date
            </Text>

            <Text
              style={styles.emptyText}
            >
              Add a task for this date
              using the + button.
            </Text>

          </View>
        )}


        {/* ==================================================
            MORNING
        ================================================== */}

        {renderSection(
          'Morning',
          selectedTasks.filter(
            (task) =>
              task.time < '12:00'
          ),
          '#FF9F43'
        )}


        {/* ==================================================
            AFTERNOON
        ================================================== */}

        {renderSection(
          'Afternoon',
          selectedTasks.filter(
            (task) =>
              task.time >= '12:00' &&
              task.time < '17:00'
          ),
          '#FFD21F'
        )}


        {/* ==================================================
            EVENING
        ================================================== */}

        {renderSection(
          'Evening',
          selectedTasks.filter(
            (task) =>
              task.time >= '17:00' &&
              task.time < '21:00'
          ),
          '#A76BCF'
        )}


        {/* ==================================================
            NIGHT
        ================================================== */}

        {renderSection(
          'Night',
          selectedTasks.filter(
            (task) =>
              task.time >= '21:00'
          ),
          '#5577E8'
        )}


        <View
          style={styles.bottomSpace}
        />

      </ScrollView>


      {/* ==================================================
          FLOATING +
      ================================================== */}

      <Pressable
        style={styles.floatingButton}
        onPress={() =>
          router.navigate({
            pathname: '/add-task',
            params: {
              date: selectedDate,
            },
          })
        }
      >

        <Text style={styles.plus}>
          +
        </Text>

      </Pressable>


      {/* ==================================================
          BOTTOM NAVIGATION
      ================================================== */}

      <View
        style={
          styles.bottomNavigation
        }
      >

        {/* TODAY */}

        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.navigate('/tasks')
          }
        >

          <Text
            style={styles.navIcon}
          >
            🏠
          </Text>

          <Text
            style={styles.navText}
          >
            Today
          </Text>

        </Pressable>


        {/* CALENDAR */}

        <Pressable
          style={styles.navItem}
        >

          <Text
            style={
              styles.navIconActive
            }
          >
            ▦
          </Text>

          <Text
            style={
              styles.activeNavText
            }
          >
            Calendar
          </Text>

        </Pressable>


        {/* STATS */}

        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.navigate('/stats')
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


        {/* PROFILE */}

        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.navigate('/profile')
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

    </SafeAreaView>
  );
}


// ======================================================
// STYLES
// ======================================================

const createStyles = (colors: any) => StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },


  // STATUS BAR

  statusBar: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  statusTime: {
    fontSize: 10,
    color: colors.text,
    fontWeight: '600',
  },

  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  signal: {
    width: 12,
    height: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },

  bar: {
    width: 2,
    backgroundColor: colors.text,
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
    backgroundColor: colors.text,
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
    backgroundColor: colors.text,
    borderRadius: 1,
  },

  batteryTip: {
    position: 'absolute',
    right: -3,
    top: 2,
    width: 2,
    height: 4,
    backgroundColor: colors.text,
  },


  // SCROLL

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
  },


  // TITLE

  pageTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 14,
  },


  // CALENDAR

  calendarCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingTop: 13,
    paddingBottom: 10,
  },

  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  monthArrowButton: {
    width: 35,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  monthTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  arrow: {
    color: colors.muted,
    fontSize: 22,
  },


  // WEEK DAYS

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },

  weekDay: {
    width: 40,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 9,
  },


  // CALENDAR GRID

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dateCell: {
    width: '14.285%',
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  selectedDate: {
    backgroundColor: colors.accent,
  },

  dateText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  },

  selectedDateText: {
    color: colors.text,
    fontWeight: '700',
  },


  // TASK DOT

  taskDot: {
    position: 'absolute',
    bottom: 7,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FF9F43',
  },

  selectedTaskDot: {
    backgroundColor: colors.text,
  },


  // SELECTED DATE

  tasksDate: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 21,
    marginBottom: 12,
  },


  // EMPTY

  emptyBox: {
    backgroundColor: colors.card,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 25,
    alignItems: 'center',
    marginBottom: 15,
  },

  emptyIcon: {
    fontSize: 25,
    marginBottom: 8,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },

  emptyText: {
    color: colors.muted,
    fontSize: 9,
    marginTop: 5,
  },


  // SECTIONS

  section: {
    marginBottom: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },


  // TASK CARD

  taskCard: {
    minHeight: 70,
    backgroundColor: colors.card,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 9,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },


  // CHECKBOX

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.accentStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  checkboxCompleted: {
    backgroundColor: colors.accentStrong,
  },

  checkMark: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },


  // TASK INFO

  taskInfo: {
    flex: 1,
  },

  taskTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },

  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#71819B',
  },

  taskMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },

  taskDate: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },

  arrowRight: {
    color: colors.muted,
    fontSize: 25,
    fontWeight: '300',
    marginLeft: 8,
  },


  bottomSpace: {
    height: 90,
  },


  // FLOATING BUTTON

  floatingButton: {
    position: 'absolute',
    right: 18,
    bottom: 70,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 7,
  },

  plus: {
    fontSize: 30,
    color: colors.text,
    fontWeight: '300',
  },


  // BOTTOM NAV

  bottomNavigation: {
    height: 58,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIcon: {
    fontSize: 17,
    marginBottom: 2,
    color: colors.muted,
  },

  navIconActive: {
    fontSize: 17,
    marginBottom: 2,
  },

  activeNavText: {
    fontSize: 12,
    color: colors.accentStrong,
    fontWeight: '700',
  },

  navText: {
    fontSize: 12,
    color: colors.muted,
  },

});