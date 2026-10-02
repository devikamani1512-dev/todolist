import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '../context/ThemeContext';
import { useTasks, Task } from '../context/TaskContext';

const COLORS = {
  background: '#0B1425',
  card: '#182942',
  border: '#30415B',
  white: '#FFFFFF',
  muted: '#7286A5',
  cyan: '#3CC3CB',
  yellow: '#FFD84D',
  green: '#3CC3CB',
  red: '#F14E5A',
};

const categories = [
  { name: 'Health', icon: '💪' },
  { name: 'Work', icon: '💼' },
  { name: 'Study', icon: '📚' },
  { name: 'Home', icon: '🏠' },
  { name: 'Personal', icon: '🌸' },
  { name: 'Errands', icon: '🛒' },
];

export default function StatsScreen() {
  const router = useRouter();

  const { colors } = useTheme();
  const { tasks } = useTasks();
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
  // --------------------------------------------------
  // TODAY
  // --------------------------------------------------

  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');

  // --------------------------------------------------
  // CHECK WHETHER TASK IS AVAILABLE ON A DATE
  // --------------------------------------------------

  const isTaskForDate = (
    task: Task,
    date: string
  ) => {
    if (
      date < task.startDate ||
      date > task.endDate
    ) {
      return false;
    }

    // Custom-date tasks appear only on their
    // selected custom dates.
    if (task.repeat === 'custom') {
      return task.customDates.includes(date);
    }

    // For all other tasks, the From-To date range
    // controls whether the task is active.
    // This matches the Today and Calendar pages.
    return true;
  };

  // --------------------------------------------------
  // TODAY TOTAL
  // --------------------------------------------------

  const todayTasks = useMemo(() => {
    return tasks.filter((task) =>
      isTaskForDate(task, today)
    );
  }, [tasks]);

  // --------------------------------------------------
  // TODAY TASK TOTAL
  // --------------------------------------------------

  // Count only tasks that are applicable today.
  // This keeps Stats consistent with the Today page.
  const totalTasks = todayTasks.length;

  const totalCompleted = todayTasks.filter(
    (task) => task.completedDates.includes(today)
  ).length;

  const totalPending =
    totalTasks - totalCompleted;

  const completionPercentage =
    totalTasks > 0
      ? Math.round(
          (totalCompleted / totalTasks) * 100
        )
      : 0;

  // --------------------------------------------------
  // LAST 7 DAYS
  // --------------------------------------------------

  const last7Days = useMemo(() => {
    const result: {
      date: string;
      day: string;
      completed: number;
      pending: number;
      total: number;
    }[] = [];

    const baseDate = new Date(
      `${today}T00:00:00`
    );

    for (let i = 6; i >= 0; i--) {
      const current = new Date(baseDate);

      current.setDate(
        baseDate.getDate() - i
      );

      const year =
        current.getFullYear();

      const month = String(
        current.getMonth() + 1
      ).padStart(2, '0');

      const dayNumber = String(
        current.getDate()
      ).padStart(2, '0');

      const date =
        `${year}-${month}-${dayNumber}`;

      const tasksForDay = tasks.filter(
        (task) =>
          isTaskForDate(task, date)
      );

      const completed = tasksForDay.filter(
        (task) =>
          task.completedDates.includes(date)
      ).length;

      const dayName =
        current
          .toLocaleDateString('en-US', {
            weekday: 'short',
          })
          .charAt(0);

      result.push({
        date,
        day: dayName,
        completed,
        pending:
          tasksForDay.length - completed,
        total: tasksForDay.length,
      });
    }

    return result;
  }, [tasks]);

  // --------------------------------------------------
  // STREAK
  // --------------------------------------------------

  const dayStreak = useMemo(() => {
    let streak = 0;

    for (
      let i = 0;
      i < 30;
      i++
    ) {
      const current = new Date(
        `${today}T00:00:00`
      );

      current.setDate(
        current.getDate() - i
      );

      const year =
        current.getFullYear();

      const month = String(
        current.getMonth() + 1
      ).padStart(2, '0');

      const day = String(
        current.getDate()
      ).padStart(2, '0');

      const date =
        `${year}-${month}-${day}`;

      const dayTasks = tasks.filter(
        (task) =>
          isTaskForDate(task, date)
      );

      if (dayTasks.length === 0) {
        continue;
      }

      const allCompleted =
        dayTasks.every((task) =>
          task.completedDates.includes(date)
        );

      if (!allCompleted) {
        break;
      }

      streak++;
    }

    return streak;
  }, [tasks]);

  // --------------------------------------------------
  // CATEGORY STATISTICS
  // --------------------------------------------------

  const categoryStats = useMemo(() => {
    return categories.map((category) => {
      const categoryTasks =
        todayTasks.filter(
          (task) =>
            task.category === category.name
        );

      const completed =
        categoryTasks.filter((task) =>
          task.completedDates.includes(today)
        ).length;

      return {
        ...category,
        total: categoryTasks.length,
        completed,
      };
    });
  }, [todayTasks]);

  // --------------------------------------------------
  // LAST 7 DAYS MAX VALUE
  // --------------------------------------------------

  const maxCompleted = Math.max(
    ...last7Days.map(
      (item) => item.completed
    ),
    1
  );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  return (
    <SafeAreaView style={styles.screen}>
      {/* STATUS BAR */}

      <View style={styles.statusBar}>
        <Text style={styles.statusTime}>
  {currentTime.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}
</Text>

        <Text style={styles.statusIcons}>
          ▮▮▮  ◔  ▰
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* TITLE */}

        <Text style={styles.pageTitle}>
          Stats
        </Text>

        {/* TOP STAT CARDS */}

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {totalCompleted}
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {totalPending}
            </Text>

            <Text style={styles.statLabel}>
              Pending
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {dayStreak}
            </Text>

            <Text style={styles.statLabel}>
              Day streak 🔥
            </Text>
          </View>
        </View>

        {/* TODAY SUMMARY */}

        <View style={styles.summaryCard}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>
              {completionPercentage}%
            </Text>
          </View>

          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>
              {totalCompleted} of{' '}
              {totalTasks} tasks done
            </Text>

            <Text style={styles.summarySubtitle}>
              {totalPending > 0
                ? `${totalPending} task${
                    totalPending > 1
                      ? 's'
                      : ''
                  } pending`
                : 'All tasks completed 🎉'}
            </Text>
          </View>
        </View>

        {/* LAST 7 DAYS */}

        <Text style={styles.sectionTitle}>
          Last 7 days
        </Text>

        <View style={styles.chartCard}>
          <View style={styles.chartArea}>
            {last7Days.map((item) => {
              const height =
                item.completed > 0
                  ? Math.max(
                      12,
                      (item.completed /
                        maxCompleted) *
                        110
                    )
                  : 4;

              return (
                <View
                  key={item.date}
                  style={styles.barColumn}
                >
                  <Text
                    style={styles.barValue}
                  >
                    {item.completed}
                  </Text>

                  <View
                    style={[
                      styles.bar,
                      {
                        height,
                      },
                    ]}
                  />

                  <Text
                    style={styles.dayText}
                  >
                    {item.day}
                  </Text>

                  <Text
                    style={styles.totalText}
                  >
                    {item.completed}/
                    {item.total}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        

        {/* CATEGORY */}

        <Text style={styles.sectionTitle}>
          By category
        </Text>

        <View style={styles.categoryCard}>
          {categoryStats.map((item) => (
            <View
              key={item.name}
              style={styles.categoryRow}
            >
              <Text style={styles.categoryName}>
                {item.icon} {item.name}
              </Text>

              <Text style={styles.categoryCount}>
                {item.completed}/{item.total}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* FLOATING ADD BUTTON */}

      <Pressable
        style={styles.floatingButton}
        onPress={() =>
          router.navigate('/add-task')
        }
      >
        <Text style={styles.floatingPlus}>
          +
        </Text>
      </Pressable>

      {/* BOTTOM NAVIGATION */}

      <View style={styles.bottomNavigation}>
        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.navigate('/tasks')
          }
        >
          <Text style={styles.navIcon}>
            🏠
          </Text>

          <Text style={styles.navText}>
            Today
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.navigate('/calendar')
          }
        >
          <Text style={styles.navIcon}>
            ▦
          </Text>

          <Text style={styles.navText}>
            Calendar
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
        >
          <Text style={styles.navIcon}>
            📊
          </Text>

          <Text
            style={styles.activeNavText}
          >
            Stats
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.navigate('/profile')
          }
        >
          <Text style={styles.navIcon}>
            👤
          </Text>

          <Text style={styles.navText}>
            Profile
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// --------------------------------------------------
// FORMAT DATE
// --------------------------------------------------

function formatDay(date: string) {
  const value = new Date(
    `${date}T00:00:00`
  );

  return value.toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
    }
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const createStyles = (colors: any) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  statusBar: {
    height: 28,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusTime: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '700',
  },

  statusIcons: {
    color: colors.text,
    fontSize: 8,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 20,
  },

  pageTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 14,
  },

  statRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },

  statCard: {
    flex: 1,
    height: 75,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statNumber: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },

  statLabel: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 3,
  },

  summaryCard: {
    backgroundColor: colors.summary,
    minHeight: 110,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.text,
    borderWidth: 8,
    borderColor: '#FFF3B0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressText: {
    color: colors.onSummary,
    fontSize: 18,
    fontWeight: '800',
  },

  summaryInfo: {
    marginLeft: 18,
  },

  summaryTitle: {
    color: colors.onSummary,
    fontSize: 18,
    fontWeight: '800',
  },

  summarySubtitle: {
  color: '#126EED',
    fontSize: 16,
    marginTop: 5,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },

  chartCard: {
    height: 145,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 22,
  },

  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },

  barValue: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 3,
  },

  bar: {
    width: 24,
    backgroundColor: colors.accent,
    borderRadius: 5,
    minHeight: 4,
  },

  dayText: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 5,
  },

  totalText: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 4,
  },

  dayDetailsCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 22,
  },

  dayDetailRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },

  detailDay: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

  detailDate: {
    color: colors.muted,
    fontSize: 18,
    marginTop: 3,
  },

  detailCounts: {
    flexDirection: 'row',
    gap: 12,
  },

  completedCount: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },

  pendingCount: {
    color: '#F4B942',
    fontSize: 14,
    fontWeight: '700',
  },

  categoryCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  categoryRow: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },

  categoryName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  categoryCount: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },

  floatingButton: {
    position: 'absolute',
    right: 18,
    bottom: 69,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  floatingPlus: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '300',
  },

  bottomNavigation: {
    height: 58,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  navItem: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIcon: {
    fontSize: 15,
    marginBottom: 2,
  },

  navText: {
    color: colors.muted,
    fontSize: 12,
  },

  activeNavText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
  },
});