import React, { useMemo, useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import { useTheme } from '../context/ThemeContext';

import {
  useTasks,
  Task,
} from '../context/TaskContext';


export default function AddTaskScreen() {

  const router = useRouter();

  const { colors } = useTheme();

  const params = useLocalSearchParams();

  const {
    addTask,
    updateTask,
  } = useTasks();


  // ==========================================
  // EDIT MODE
  // ==========================================

  const editId =
    typeof params.editId === 'string'
      ? params.editId
      : null;

  const isEditMode = editId !== null;


  // ==========================================
  // TASK DETAILS
  // ==========================================

  const [taskTitle, setTaskTitle] =
    useState(
      typeof params.title === 'string'
        ? params.title
        : ''
    );


  const [selectedCategory, setSelectedCategory] =
    useState(
      typeof params.category === 'string'
        ? params.category
        : 'Personal'
    );


  const [time, setTime] =
    useState(
      typeof params.time === 'string'
        ? params.time
        : '09:00'
    );


  const [fromDate, setFromDate] =
    useState(
      typeof params.startDate === 'string'
        ? params.startDate
        : '2026-10-01'
    );


  const [toDate, setToDate] =
    useState(
      typeof params.endDate === 'string'
        ? params.endDate
        : '2026-10-01'
    );


  // ==========================================
  // SUBTASKS
  // ==========================================

  const [subtasks, setSubtasks] =
    useState<string[]>(() => {

      if (
        typeof params.subtasks === 'string'
      ) {

        try {

          const data =
            JSON.parse(params.subtasks);

          if (Array.isArray(data)) {
            return data;
          }

        } catch {}

      }

      return [];
    });


  const [newSubtask, setNewSubtask] =
    useState('');


  // ==========================================
  // MODALS
  // ==========================================

  const [showTimePicker, setShowTimePicker] =
    useState(false);


  const [showFromDatePicker, setShowFromDatePicker] =
    useState(false);


  const [showToDatePicker, setShowToDatePicker] =
    useState(false);


  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = [

    {
      name: 'Health',
      icon: '💪',
    },

    {
      name: 'Work',
      icon: '💼',
    },

    {
      name: 'Study',
      icon: '📚',
    },

    {
      name: 'Home',
      icon: '🏠',
    },

    {
      name: 'Personal',
      icon: '🌸',
    },

    {
      name: 'Errands',
      icon: '🛒',
    },

  ];


  // ==========================================
  // TIME LIST
  // ==========================================

  const times = [

    '06:00',
    '06:30',

    '07:00',
    '07:30',

    '08:00',
    '08:30',

    '09:00',
    '09:30',

    '10:00',
    '10:30',

    '11:00',
    '11:30',

    '12:00',
    '12:30',

    '13:00',
    '13:30',

    '14:00',
    '14:30',

    '15:00',
    '15:30',

    '16:00',
    '16:30',

    '17:00',
    '17:30',

    '18:00',
    '18:30',

    '19:00',
    '19:30',

    '20:00',
    '20:30',

    '21:00',
    '21:30',

    '22:00',

  ];


  // ==========================================
  // DATE LIST
  // ==========================================

  const generateDates = () => {

    const dates: string[] = [];

    for (
      let day = 1;
      day <= 31;
      day++
    ) {

      const date =
        `2026-10-${String(day).padStart(2, '0')}`;

      dates.push(date);

    }

    return dates;
  };


  const dates = generateDates();


  // ==========================================
  // ADD SUBTASK
  // ==========================================

  const addSubtask = () => {

    if (newSubtask.trim() === '') {
      return;
    }

    setSubtasks((current) => [

      ...current,

      newSubtask.trim(),

    ]);

    setNewSubtask('');

  };


  // ==========================================
  // REMOVE SUBTASK
  // ==========================================

  const removeSubtask = (
    index: number
  ) => {

    setSubtasks((current) =>
      current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );

  };


  // ==========================================
  // SAVE / UPDATE TASK
  // ==========================================

  const handleSave = () => {

    if (taskTitle.trim() === '') {
      return;
    }


    // ========================================
    // EDIT EXISTING TASK
    // ========================================

    if (isEditMode && editId) {

      updateTask(editId, {

        title:
          taskTitle.trim(),

        category:
          selectedCategory,

        time,

        startDate:
          fromDate,

        endDate:
          toDate,

        // Existing task-க்கு repeat
        // value change செய்யவில்லை.
        // Once மட்டும் வைத்திருக்கிறோம்.

        repeat: 'once',

        subtasks,

        completedSubtasks:
          subtasks.map(() => false),

      });


      // ======================================
      // UPDATE முடிந்ததும்
      // SAME TASK DETAILS PAGE
      // ======================================

      router.replace({

        pathname: '/task-details',

        params: {

          id: editId,

          title:
            taskTitle.trim(),

          category:
            selectedCategory,

          time,

          startDate:
            fromDate,

          endDate:
            toDate,

          subtasks:
            JSON.stringify(subtasks),

        },

      });

      return;
    }


    // ========================================
    // CREATE NEW TASK
    // ========================================

    const newTask: Task = {

      id:
        Date.now().toString(),

      title:
        taskTitle.trim(),

      category:
        selectedCategory,

      time,

      // New task default
      // repeat once

      repeat:
        'once',

      startDate:
        fromDate,

      endDate:
        toDate,

      customDates: [],

      completedDates: [],

      subtasks,

      completedSubtasks:
        subtasks.map(() => false),

    };


    addTask(newTask);


    // New task create ஆனதும்
    // Tasks page

    router.replace('/tasks');

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


  // ==========================================
  // DATE SELECT
  // ==========================================

  const selectDate = (

    selectedDate: string,

    type: 'from' | 'to'

  ) => {

    if (type === 'from') {

      setFromDate(selectedDate);

      setShowFromDatePicker(false);

    } else {

      setToDate(selectedDate);

      setShowToDatePicker(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  return (

    <SafeAreaView style={styles.screen}>

      {/* DARK OVERLAY */}

      <View style={styles.overlay} />


      {/* ======================================
          MAIN SHEET
      ====================================== */}

      <View style={styles.modal}>


        {/* HEADER */}

        <View style={styles.headerRow}>

          <Text style={styles.title}>

            {isEditMode
              ? 'Edit task'
              : 'New task'}

          </Text>


          <Pressable
            onPress={() =>
              router.replace('/tasks')
            }
          >
            <Text style={styles.closeText}>
              ×
            </Text>
          </Pressable>

        </View>


        {/* ====================================
            TASK TITLE
        ==================================== */}

        <TextInput

          style={styles.taskInput}

          placeholder="Task enna?"

          placeholderTextColor="#64748B"

          value={taskTitle}

          onChangeText={setTaskTitle}

        />


        {/* ====================================
            CATEGORY
        ==================================== */}

        <View
          style={styles.categoryContainer}
        >

          {categories.map((item) => (

            <Pressable

              key={item.name}

              style={[

                styles.categoryButton,

                selectedCategory ===
                  item.name &&
                  styles.categorySelected,

              ]}

              onPress={() =>
                setSelectedCategory(
                  item.name
                )
              }

            >

              <Text

                style={[

                  styles.categoryText,

                  selectedCategory ===
                    item.name &&
                    styles.categoryTextSelected,

                ]}

              >

                {item.icon} {item.name}

              </Text>

            </Pressable>

          ))}

        </View>


        {/* ====================================
            TIME + FROM + TO
        ==================================== */}

        <View style={styles.dateRow}>


          {/* TIME */}

          <Pressable

            style={styles.timeInput}

            onPress={() =>
              setShowTimePicker(true)
            }

          >

            <Text style={styles.inputText}>
              {time}
            </Text>

            <Text style={styles.inputIcon}>
              🕘
            </Text>

          </Pressable>


          {/* FROM */}

          <Pressable

            style={styles.dateInput}

            onPress={() =>
              setShowFromDatePicker(true)
            }

          >

            <Text style={styles.smallLabel}>
              From
            </Text>

            <Text style={styles.dateValue}>
              {formatDate(fromDate)}
            </Text>

            <Text style={styles.dateIcon}>
              📅
            </Text>

          </Pressable>


          {/* TO */}

          <Pressable

            style={styles.dateInput}

            onPress={() =>
              setShowToDatePicker(true)
            }

          >

            <Text style={styles.smallLabel}>
              To
            </Text>

            <Text style={styles.dateValue}>
              {formatDate(toDate)}
            </Text>

            <Text style={styles.dateIcon}>
              📅
            </Text>

          </Pressable>

        </View>


        {/* ====================================
            SUBTASKS
        ==================================== */}

        <View
          style={styles.subtaskSection}
        >

          <Text
            style={styles.subtaskTitle}
          >
            Subtasks
          </Text>


          {/* EXISTING SUBTASKS */}

          {subtasks.map(
            (item, index) => (

              <View

                key={`${item}-${index}`}

                style={styles.subtaskItem}

              >

                <Text
                  style={styles.subtaskText}
                >
                  {item}
                </Text>


                <Pressable

                  onPress={() =>
                    removeSubtask(index)
                  }

                >

                  <Text
                    style={styles.removeText}
                  >
                    ×
                  </Text>

                </Pressable>

              </View>

            )
          )}


          {/* ADD SUBTASK */}

          <View
            style={styles.subtaskInputRow}
          >

            <TextInput

              style={styles.subtaskInput}

              placeholder="Add a subtask..."

              placeholderTextColor="#64748B"

              value={newSubtask}

              onChangeText={
                setNewSubtask
              }

              onSubmitEditing={
                addSubtask
              }

            />


            <Pressable

              style={
                styles.subtaskAddButton
              }

              onPress={addSubtask}

            >

              <Text
                style={
                  styles.subtaskAddText
                }
              >
                +
              </Text>

            </Pressable>

          </View>

        </View>


        {/* ====================================
            SAVE / UPDATE
        ==================================== */}

        <Pressable

          style={[

            styles.addButton,

            taskTitle.trim() === '' &&
              styles.disabledButton,

          ]}

          onPress={handleSave}

          disabled={
            taskTitle.trim() === ''
          }

        >

          <Text
            style={styles.addButtonText}
          >

            {isEditMode
              ? 'Update task'
              : 'Add task'}

          </Text>

        </Pressable>

      </View>


      {/* ======================================
          TIME PICKER
      ====================================== */}

      <Modal

        visible={showTimePicker}

        transparent

        animationType="fade"

        onRequestClose={() =>
          setShowTimePicker(false)
        }

      >

        <View
          style={styles.pickerOverlay}
        >

          <View
            style={styles.timeModal}
          >

            <View
              style={styles.pickerHeader}
            >

              <Text
                style={styles.pickerTitle}
              >
                Select time
              </Text>


              <Pressable

                onPress={() =>
                  setShowTimePicker(false)
                }

              >

                <Text
                  style={styles.closeText}
                >
                  ×
                </Text>

              </Pressable>

            </View>


            <Text
              style={styles.selectedTime}
            >
              {time}
            </Text>


            <ScrollView

              showsVerticalScrollIndicator={
                false
              }

              contentContainerStyle={
                styles.timeGrid
              }

            >

              {times.map(
                (item) => (

                  <Pressable

                    key={item}

                    style={[

                      styles.timeButton,

                      time === item &&
                        styles.timeSelected,

                    ]}

                    onPress={() => {

                      setTime(item);

                      setShowTimePicker(
                        false
                      );

                    }}

                  >

                    <Text

                      style={[

                        styles.timeButtonText,

                        time === item &&
                          styles.timeSelectedText,

                      ]}

                    >
                      {item}
                    </Text>

                  </Pressable>

                )
              )}

            </ScrollView>

          </View>

        </View>

      </Modal>


      {/* ======================================
          FROM DATE PICKER
      ====================================== */}

      <Modal

        visible={showFromDatePicker}

        transparent

        animationType="fade"

        onRequestClose={() =>
          setShowFromDatePicker(false)
        }

      >

        <View
          style={styles.pickerOverlay}
        >

          <View
            style={styles.calendarModal}
          >

            <View
              style={styles.calendarHeader}
            >

              <Text
                style={styles.calendarTitle}
              >
                October, 2026
              </Text>


              <Pressable

                onPress={() =>
                  setShowFromDatePicker(
                    false
                  )
                }

              >

                <Text
                  style={styles.closeText}
                >
                  ×
                </Text>

              </Pressable>

            </View>


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
                      styles.weekText
                    }

                  >
                    {day}
                  </Text>

                )
              )}

            </View>


            <View
              style={styles.calendarGrid}
            >

              {dates.map(
                (item) => (

                  <Pressable

                    key={item}

                    style={[

                      styles.dayButton,

                      fromDate === item &&
                        styles.daySelected,

                    ]}

                    onPress={() =>
                      selectDate(
                        item,
                        'from'
                      )
                    }

                  >

                    <Text

                      style={[

                        styles.dayText,

                        fromDate === item &&
                          styles.daySelectedText,

                      ]}

                    >

                      {Number(
                        item.split('-')[2]
                      )}

                    </Text>

                  </Pressable>

                )
              )}

            </View>

          </View>

        </View>

      </Modal>


      {/* ======================================
          TO DATE PICKER
      ====================================== */}

      <Modal

        visible={showToDatePicker}

        transparent

        animationType="fade"

        onRequestClose={() =>
          setShowToDatePicker(false)
        }

      >

        <View
          style={styles.pickerOverlay}
        >

          <View
            style={styles.calendarModal}
          >

            <View
              style={styles.calendarHeader}
            >

              <Text
                style={styles.calendarTitle}
              >
                October, 2026
              </Text>


              <Pressable

                onPress={() =>
                  setShowToDatePicker(
                    false
                  )
                }

              >

                <Text
                  style={styles.closeText}
                >
                  ×
                </Text>

              </Pressable>

            </View>


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
                      styles.weekText
                    }

                  >
                    {day}
                  </Text>

                )
              )}

            </View>


            <View
              style={styles.calendarGrid}
            >

              {dates.map(
                (item) => (

                  <Pressable

                    key={item}

                    style={[

                      styles.dayButton,

                      toDate === item &&
                        styles.daySelected,

                    ]}

                    onPress={() =>
                      selectDate(
                        item,
                        'to'
                      )
                    }

                  >

                    <Text

                      style={[

                        styles.dayText,

                        toDate === item &&
                          styles.daySelectedText,

                      ]}

                    >

                      {Number(
                        item.split('-')[2]
                      )}

                    </Text>

                  </Pressable>

                )
              )}

            </View>

          </View>

        </View>

      </Modal>

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
    justifyContent: 'flex-end',
  },


  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      colors.overlay,
  },


  modal: {
    backgroundColor: colors.card,

    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,

    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 22,

    maxHeight: '92%',
  },


  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 16,
  },


  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },


  closeText: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '300',
  },


  taskInput: {
    height: 48,

    backgroundColor: colors.background,

    borderWidth: 1,
    borderColor: colors.inputBorder,

    borderRadius: 10,

    paddingHorizontal: 14,

    color: colors.text,
    fontSize: 14,

    marginBottom: 12,
  },


  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,

    marginBottom: 14,
  },


  categoryButton: {
    borderWidth: 1,
    borderColor: colors.inputBorder,

    borderRadius: 20,

    paddingHorizontal: 14,
    paddingVertical: 9,
  },


  categorySelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },


  categoryText: {
    color: colors.text,

    fontSize: 13,

    fontWeight: '600',
  },


  categoryTextSelected: {
    color: colors.text,
  },


  // ==========================================
  // TIME + DATE
  // ==========================================

  dateRow: {
    flexDirection: 'row',

    gap: 8,

    marginBottom: 12,
  },


  timeInput: {
    width: 110,
    height: 48,

    backgroundColor: colors.background,

    borderWidth: 1,
    borderColor: colors.inputBorder,

    borderRadius: 10,

    paddingHorizontal: 12,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  dateInput: {
    flex: 1,

    height: 48,

    backgroundColor: colors.background,

    borderWidth: 1,
    borderColor: colors.inputBorder,

    borderRadius: 10,

    paddingHorizontal: 10,

    justifyContent: 'center',

    position: 'relative',
  },


  inputText: {
    color: colors.text,
    fontSize: 13,
  },


  inputIcon: {
    fontSize: 13,
  },


  smallLabel: {
    color: colors.muted,
    fontSize: 8,
  },


  dateValue: {
    color: colors.text,

    fontSize: 11,

    marginTop: 2,
  },


  dateIcon: {
    position: 'absolute',

    right: 8,
    top: 16,

    fontSize: 13,
  },


  // ==========================================
  // SUBTASKS
  // ==========================================

  subtaskSection: {
    marginBottom: 14,
  },


  subtaskTitle: {
    color: colors.text,

    fontSize: 14,

    fontWeight: '700',

    marginBottom: 8,
  },


  subtaskItem: {
    minHeight: 36,

    backgroundColor: colors.background,

    borderWidth: 1,
    borderColor: colors.inputBorder,

    borderRadius: 8,

    paddingHorizontal: 10,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 6,
  },


  subtaskText: {
    color: colors.text,
    fontSize: 11,
  },


  removeText: {
    color: colors.danger,
    fontSize: 20,
  },


  subtaskInputRow: {
    height: 40,

    backgroundColor: colors.background,

    borderWidth: 1,
    borderColor: colors.inputBorder,

    borderRadius: 8,

    flexDirection: 'row',

    alignItems: 'center',

    paddingLeft: 10,
  },


  subtaskInput: {
    flex: 1,

    color: colors.text,

    fontSize: 11,
  },


  subtaskAddButton: {
    width: 38,
    height: 38,

    borderRadius: 8,

    backgroundColor: colors.accent,

    alignItems: 'center',
    justifyContent: 'center',
  },


  subtaskAddText: {
    color: colors.text,
    fontSize: 20,
  },


  // ==========================================
  // ADD / UPDATE BUTTON
  // ==========================================

  addButton: {
    height: 48,

    backgroundColor: colors.accent,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },


  disabledButton: {
    opacity: 0.5,
  },


  addButtonText: {
    color: colors.text,

    fontSize: 15,

    fontWeight: '800',
  },


  // ==========================================
  // PICKER
  // ==========================================

  pickerOverlay: {
    flex: 1,

    backgroundColor:
      colors.overlay,

    alignItems: 'center',
    justifyContent: 'center',
  },


  // ==========================================
  // TIME MODAL
  // ==========================================

  timeModal: {
    width: '88%',

    maxHeight: '82%',

    backgroundColor: colors.card,

    borderRadius: 20,

    padding: 18,
  },


  pickerHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },


  pickerTitle: {
    color: colors.text,

    fontSize: 18,

    fontWeight: '800',
  },


  selectedTime: {
    color: colors.accent,

    fontSize: 28,

    fontWeight: '800',

    textAlign: 'center',

    marginVertical: 15,
  },


  timeGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 8,
  },


  timeButton: {
    width: '23%',

    height: 42,

    backgroundColor: colors.background,

    borderWidth: 1,
    borderColor: colors.inputBorder,

    borderRadius: 9,

    alignItems: 'center',

    justifyContent: 'center',
  },


  timeSelected: {
    backgroundColor: colors.accent,

    borderColor: colors.accent,
  },


  timeButtonText: {
    color: colors.text,

    fontSize: 10,

    fontWeight: '600',
  },


  timeSelectedText: {
    fontWeight: '800',
  },


  // ==========================================
  // CALENDAR
  // ==========================================

  calendarModal: {
    width: '82%',

    backgroundColor: colors.text,

    borderRadius: 8,

    padding: 14,
  },


  calendarHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 14,
  },


  calendarTitle: {
    color: '#1F2937',

    fontSize: 14,

    fontWeight: '700',
  },


  weekRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 6,
  },


  weekText: {
    width: 32,

    textAlign: 'center',

    color: '#475569',

    fontSize: 10,

    fontWeight: '700',
  },


  calendarGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',
  },


  dayButton: {
    width: '14.28%',

    height: 36,

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: 3,
  },


  daySelected: {
    backgroundColor: '#126EED',
  },


  dayText: {
    color: '#334155',

    fontSize: 11,
  },


  daySelectedText: {
    color: colors.text,

    fontWeight: '800',
  },

});