import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useTasks,
} from '../context/TaskContext';


export default function TaskDetailsScreen() {

  const router = useRouter();

  const params = useLocalSearchParams();

  const {
    tasks,
    toggleTask,
    deleteTask,
  } = useTasks();


  // ==========================================
  // GET TASK ID
  // ==========================================

  const taskId =
    typeof params.id === 'string'
      ? params.id
      : '';


  // ==========================================
  // FIND TASK
  // ==========================================

  const task = tasks.find(
    (item) => item.id === taskId
  );


  // ==========================================
  // IF TASK NOT FOUND
  // ==========================================

  if (!task) {

    return (

      <SafeAreaView style={styles.screen}>

        <View style={styles.errorContainer}>

          <Text style={styles.errorTitle}>
            Task not found
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.replace('/tasks')
            }
          >

            <Text style={styles.backButtonText}>
              Back to Tasks
            </Text>

          </Pressable>

        </View>

      </SafeAreaView>

    );

  }


  // ==========================================
  // CURRENT DATE
  // ==========================================

  const currentDate =
    new Date().toISOString().split('T')[0];


  // ==========================================
  // COMPLETED STATUS
  // ==========================================

  const completed =
    task.completedDates.includes(
      currentDate
    );


  // ==========================================
  // EDIT TASK
  // ==========================================

  const handleEdit = () => {

    router.push({

      pathname: '/add-task',

      params: {

        editId: task.id,

        title: task.title,

        category: task.category,

        time: task.time,

        startDate: task.startDate,

        endDate: task.endDate,

        subtasks:
          JSON.stringify(task.subtasks || []),

      },

    });

  };


  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDelete = () => {

    deleteTask(task.id);

    router.replace('/tasks');

  };


  // ==========================================
  // MARK COMPLETE
  // ==========================================

  const handleComplete = () => {

    toggleTask(
      task.id,
      currentDate
    );

  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    value: string
  ) => {

    const parts =
      value.split('-');

    if (parts.length !== 3) {
      return value;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;

  };


  return (

    <SafeAreaView style={styles.screen}>


      {/* ======================================
          HEADER
      ====================================== */}

      <View style={styles.header}>

        <Pressable
          style={styles.headerBack}
          onPress={() =>
            router.replace('/tasks')
          }
        >

          <Text style={styles.backIcon}>
            ‹
          </Text>

        </Pressable>


        <Text style={styles.headerTitle}>
          Task details
        </Text>


        <View style={styles.headerSpace} />

      </View>


      {/* ======================================
          CONTENT
      ====================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >


        {/* ====================================
            TASK CARD
        ==================================== */}

        <View style={styles.taskCard}>


          {/* CHECK CIRCLE */}

          <Pressable
            style={[
              styles.checkbox,

              completed &&
                styles.checkboxCompleted,

            ]}
            onPress={handleComplete}
          >

            {completed && (

              <Text
                style={styles.checkMark}
              >
                ✓
              </Text>

            )}

          </Pressable>


          {/* TASK INFO */}

          <View style={styles.taskInfo}>

            <Text style={styles.taskTitle}>
              {task.title}
            </Text>


            <View style={styles.taskMeta}>

              <Text style={styles.metaText}>
                {task.category}
              </Text>

              <Text style={styles.dot}>
                •
              </Text>

              <Text style={styles.metaText}>
                {formatDate(task.startDate)}
              </Text>

              <Text style={styles.dot}>
                •
              </Text>

              <Text style={styles.metaText}>
                {task.time}
              </Text>

            </View>

          </View>

        </View>


        {/* ====================================
            DATE DETAILS
        ==================================== */}

        <View style={styles.dateCard}>

          <View style={styles.dateItem}>

            <Text style={styles.dateLabel}>
              From
            </Text>

            <Text style={styles.dateValue}>
              {formatDate(task.startDate)}
            </Text>

          </View>


          <View style={styles.dateDivider} />


          <View style={styles.dateItem}>

            <Text style={styles.dateLabel}>
              To
            </Text>

            <Text style={styles.dateValue}>
              {formatDate(task.endDate)}
            </Text>

          </View>


          <View style={styles.dateDivider} />


          <View style={styles.dateItem}>

            <Text style={styles.dateLabel}>
              Time
            </Text>

            <Text style={styles.dateValue}>
              {task.time}
            </Text>

          </View>

        </View>


        {/* ====================================
            SUBTASKS
        ==================================== */}

        <View style={styles.subtaskSection}>

          <View style={styles.subtaskHeader}>

            <Text style={styles.subtaskTitle}>
              Subtasks
            </Text>

            <Text style={styles.subtaskCount}>

              {(task.subtasks || []).length}

            </Text>

          </View>


          {(task.subtasks || []).length === 0 ? (

            <View style={styles.emptySubtask}>

              <Text style={styles.emptyText}>
                No subtasks added
              </Text>

            </View>

          ) : (

            (task.subtasks || []).map(
              (subtask, index) => {

                const subtaskCompleted =
                  task.completedSubtasks?.[index] ||
                  false;

                return (

                  <View
                    key={`${subtask}-${index}`}
                    style={styles.subtaskRow}
                  >

                    <View
                      style={[
                        styles.subtaskCheckbox,

                        subtaskCompleted &&
                          styles.subtaskChecked,

                      ]}
                    >

                      {subtaskCompleted && (

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

                        subtaskCompleted &&
                          styles.subtaskTextCompleted,

                      ]}
                    >
                      {subtask}
                    </Text>

                  </View>

                );

              }
            )

          )}

        </View>


        {/* ====================================
            ACTION BUTTONS
        ==================================== */}

        <View style={styles.actionRow}>


          {/* EDIT */}

          <Pressable
            style={styles.editButton}
            onPress={handleEdit}
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
            style={styles.deleteButton}
            onPress={handleDelete}
          >

            <Text style={styles.deleteIcon}>
              🗑
            </Text>

            <Text style={styles.deleteText}>
              Delete
            </Text>

          </Pressable>


          {/* COMPLETE */}

          <Pressable
            style={[
              styles.completeButton,

              completed &&
                styles.completedButton,

            ]}
            onPress={handleComplete}
          >

            <Text style={styles.completeText}>

              {completed
                ? '✓ Completed'
                : 'Mark as complete'}

            </Text>

          </Pressable>

        </View>


      </ScrollView>


      {/* ======================================
          BOTTOM NAVIGATION
      ====================================== */}

      <View style={styles.bottomNavigation}>


        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.replace('/tasks')
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
            router.replace('/categories')
          }
        >

          <Text style={styles.navIcon}>
            ▦
          </Text>

          <Text style={styles.navText}>
            Categories
          </Text>

        </Pressable>


        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.replace('/completed')
          }
        >

          <Text style={styles.navIcon}>
            ✓
          </Text>

          <Text style={styles.navText}>
            Completed
          </Text>

        </Pressable>

      </View>

    </SafeAreaView>

  );
}


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: '#0B1425',
  },


  // ==========================================
  // HEADER
  // ==========================================

  header: {
    height: 58,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingHorizontal: 14,

    borderBottomWidth: 1,

    borderBottomColor: '#1D2D45',
  },


  headerBack: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',
  },


  backIcon: {
    color: '#FFFFFF',

    fontSize: 32,

    fontWeight: '300',
  },


  headerTitle: {
    color: '#FFFFFF',

    fontSize: 17,

    fontWeight: '800',
  },


  headerSpace: {
    width: 40,
  },


  // ==========================================
  // CONTENT
  // ==========================================

  content: {
    paddingHorizontal: 14,

    paddingTop: 18,

    paddingBottom: 120,
  },


  // ==========================================
  // TASK CARD
  // ==========================================

  taskCard: {
    backgroundColor: '#182942',

    borderWidth: 1,

    borderColor: '#30415B',

    borderRadius: 16,

    padding: 14,

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 14,
  },


  checkbox: {
    width: 42,
    height: 42,

    borderRadius: 21,

    borderWidth: 2,

    borderColor: '#28D4D8',

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 12,
  },


  checkboxCompleted: {
    backgroundColor: '#28D4D8',
  },


  checkMark: {
    color: '#FFFFFF',

    fontSize: 22,

    fontWeight: '800',
  },


  taskInfo: {
    flex: 1,
  },


  taskTitle: {
    color: '#FFFFFF',

    fontSize: 14,

    fontWeight: '800',

    marginBottom: 7,
  },


  taskMeta: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,
  },


  metaText: {
    color: '#91A4BF',

    fontSize: 9,
  },


  dot: {
    color: '#64748B',

    fontSize: 9,
  },


  // ==========================================
  // DATE CARD
  // ==========================================

  dateCard: {
    backgroundColor: '#182942',

    borderWidth: 1,

    borderColor: '#30415B',

    borderRadius: 14,

    paddingVertical: 14,

    paddingHorizontal: 8,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-around',

    marginBottom: 14,
  },


  dateItem: {
    flex: 1,

    alignItems: 'center',
  },


  dateLabel: {
    color: '#7C91AE',

    fontSize: 9,

    marginBottom: 4,
  },


  dateValue: {
    color: '#FFFFFF',

    fontSize: 11,

    fontWeight: '700',
  },


  dateDivider: {
    width: 1,

    height: 28,

    backgroundColor: '#30415B',
  },


  // ==========================================
  // SUBTASKS
  // ==========================================

  subtaskSection: {
    backgroundColor: '#182942',

    borderWidth: 1,

    borderColor: '#30415B',

    borderRadius: 14,

    padding: 14,

    marginBottom: 18,
  },


  subtaskHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 12,
  },


  subtaskTitle: {
    color: '#FFFFFF',

    fontSize: 15,

    fontWeight: '800',
  },


  subtaskCount: {
    color: '#91A4BF',

    fontSize: 10,
  },


  subtaskRow: {
    minHeight: 40,

    backgroundColor: '#0D1729',

    borderWidth: 1,

    borderColor: '#30415B',

    borderRadius: 9,

    paddingHorizontal: 10,

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 7,
  },


  subtaskCheckbox: {
    width: 18,
    height: 18,

    borderRadius: 5,

    borderWidth: 1,

    borderColor: '#3CC3CB',

    marginRight: 10,

    alignItems: 'center',

    justifyContent: 'center',
  },


  subtaskChecked: {
    backgroundColor: '#3CC3CB',
  },


  subtaskCheck: {
    color: '#FFFFFF',

    fontSize: 12,

    fontWeight: '800',
  },


  subtaskText: {
    color: '#FFFFFF',

    fontSize: 11,

    flex: 1,
  },


  subtaskTextCompleted: {
    textDecorationLine: 'line-through',

    color: '#71829A',
  },


  emptySubtask: {
    paddingVertical: 14,

    alignItems: 'center',
  },


  emptyText: {
    color: '#64748B',

    fontSize: 11,
  },


  // ==========================================
  // ACTION BUTTONS
  // ==========================================

  actionRow: {
    flexDirection: 'row',

    gap: 8,
  },


  editButton: {
    flex: 1,

    height: 46,

    borderRadius: 10,

    backgroundColor: '#3478F6',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 5,
  },


  editIcon: {
    fontSize: 12,
  },


  editText: {
    color: '#FFFFFF',

    fontSize: 11,

    fontWeight: '800',
  },


  deleteButton: {
    flex: 1,

    height: 46,

    borderRadius: 10,

    backgroundColor: '#F14E5A',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 5,
  },


  deleteIcon: {
    fontSize: 12,
  },


  deleteText: {
    color: '#FFFFFF',

    fontSize: 11,

    fontWeight: '800',
  },


  completeButton: {
    flex: 1.4,

    height: 46,

    borderRadius: 10,

    backgroundColor: '#3CC3CB',

    alignItems: 'center',

    justifyContent: 'center',
  },


  completedButton: {
    backgroundColor: '#2E9E86',
  },


  completeText: {
    color: '#FFFFFF',

    fontSize: 10,

    fontWeight: '800',
  },


  // ==========================================
  // BOTTOM NAV
  // ==========================================

  bottomNavigation: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: 0,

    height: 58,

    backgroundColor: '#182942',

    borderTopWidth: 1,

    borderTopColor: '#30415B',

    flexDirection: 'row',

    justifyContent: 'space-around',

    alignItems: 'center',
  },


  navItem: {
    alignItems: 'center',

    justifyContent: 'center',

    width: 90,
  },


  navIcon: {
    fontSize: 15,

    marginBottom: 3,
  },


  navText: {
    color: '#8CA0BB',

    fontSize: 8,
  },


  // ==========================================
  // ERROR
  // ==========================================

  errorContainer: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 20,
  },


  errorTitle: {
    color: '#FFFFFF',

    fontSize: 20,

    fontWeight: '800',

    marginBottom: 20,
  },


  backButton: {
    backgroundColor: '#3CC3CB',

    paddingHorizontal: 24,

    paddingVertical: 12,

    borderRadius: 10,
  },


  backButtonText: {
    color: '#FFFFFF',

    fontWeight: '800',
  },

});