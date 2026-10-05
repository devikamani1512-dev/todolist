import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'expo-router';

import {
  useTheme,
  ThemeColors,
} from '../context/ThemeContext';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const {
    theme,
    colors,
    changeTheme,
  } = useTheme();

const [name, setName] = useState('devika');

useEffect(() => {
  const loadName = async () => {
    try {
      const savedName = await AsyncStorage.getItem('@todo_user_name');

      if (savedName) {
        setName(savedName);
      }
    } catch (error) {
      console.log('Failed to load user name', error);
    }
  };

  loadName();
}, []);

const handleNameChange = async (value: string) => {
  setName(value);

  try {
    await AsyncStorage.setItem('@todo_user_name', value);
  } catch (error) {
    console.log('Failed to save user name', error);
  }
};
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

  // NEW TASK POPUP
  const [showNewTask, setShowNewTask] = useState(false);

  // NEW TASK VALUES
  const [taskName, setTaskName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Personal');

  const addTask = () => {
    if (taskName.trim() === '') {
      return;
    }

    // Later we can connect this with Tasks page
    setTaskName('');
    setShowNewTask(false);
  };

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  const themeLabel =
    theme.charAt(0).toUpperCase() +
    theme.slice(1);

  return (
    <SafeAreaView style={styles.screen}>

      {/* ================= STATUS BAR ================= */}

      <View style={styles.statusBar}>

        <Text style={styles.statusTime}>
  {currentTime.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}
</Text>

        <View style={styles.statusRight}>

          {/* Signal */}
          <View style={styles.signal}>
            <View style={[styles.signalBar, { height: 3 }]} />
            <View style={[styles.signalBar, { height: 5 }]} />
            <View style={[styles.signalBar, { height: 7 }]} />
            <View style={[styles.signalBar, { height: 9 }]} />
          </View>

          {/* WiFi */}
          <View style={styles.wifi}>
            <View style={styles.wifiOuter} />
            <View style={styles.wifiMiddle} />
            <View style={styles.wifiDot} />
          </View>

          {/* Battery */}
          <View style={styles.battery}>
            <View style={styles.batteryFill} />
            <View style={styles.batteryTip} />
          </View>

        </View>

      </View>


      {/* ================= CONTENT ================= */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* PROFILE TITLE */}

        <Text style={styles.pageTitle}>
          Profile
        </Text>


        {/* ================= NAME CARD ================= */}

        <View style={styles.card}>

          <Text style={styles.label}>
            Your name
          </Text>

          <TextInput
  style={styles.nameInput}
  value={name}
  onChangeText={handleNameChange}
  placeholder="Your name"
  placeholderTextColor="#71819B"
/>
        </View>


        {/* ================= THEME ================= */}

        <View style={styles.optionCard}>

          <View style={styles.optionLeft}>

            <Text style={styles.optionTitle}>
              Theme:
            </Text>

            <Text style={styles.optionValue}>
              {themeLabel}
            </Text>

          </View>

          <Pressable
            style={styles.changeButton}
            onPress={changeTheme}
          >

            <Text style={styles.changeText}>
              Change
            </Text>

          </Pressable>

        </View>


        {/* ================= DELETE ================= */}

        <View style={styles.optionCard}>

          <Text style={styles.optionTitle}>
            Delete all tasks
          </Text>

          <Pressable
            style={styles.clearButton}
            onPress={() => {}}
          >

            <Text style={styles.clearText}>
              Clear
            </Text>

          </Pressable>

        </View>


        {/* ================= VERSION ================= */}

        <Text style={styles.version}>
          DayFlow v1.0
        </Text>

        <View style={styles.bottomSpace} />

      </ScrollView>


      {/* ================= FLOATING BUTTON ================= */}

      <Pressable
        style={styles.floatingButton}
        onPress={() => setShowNewTask(true)}
      >

        <Text style={styles.plus}>
          +
        </Text>

      </Pressable>


      {/* ================= BOTTOM NAV ================= */}

      <View style={styles.bottomNavigation}>

        {/* TODAY */}

        <Pressable
          style={styles.navItem}
          onPress={() => router.navigate('/tasks')}
        >

          <Text style={styles.navIcon}>
            🏠
          </Text>

          <Text style={styles.navText}>
            Today
          </Text>

        </Pressable>


        {/* CALENDAR */}

        <Pressable
          style={styles.navItem}
          onPress={() => router.navigate('/calendar')}
        >

          <Text style={styles.navIcon}>
            ▦
          </Text>

          <Text style={styles.navText}>
            Calendar
          </Text>

        </Pressable>


        {/* STATS */}

        <Pressable
          style={styles.navItem}
          onPress={() => router.navigate('/stats')}
        >

          <Text style={styles.navIcon}>
            📊
          </Text>

          <Text style={styles.navText}>
            Stats
          </Text>

        </Pressable>


        {/* PROFILE */}

        <Pressable style={styles.navItem}>

          <Text style={styles.activeIcon}>
            👤
          </Text>

          <Text style={styles.activeNavText}>
            Profile
          </Text>

        </Pressable>

      </View>


      {/* ================================================= */}
      {/* ================= NEW TASK POPUP ================ */}
      {/* ================================================= */}

      {showNewTask && (

        <View style={styles.modalOverlay}>

          <View style={styles.newTaskCard}>

            {/* TITLE */}

            <Text style={styles.newTaskTitle}>
              New task
            </Text>
            <Pressable
  onPress={() => {
    setShowNewTask(false);
    setTaskName('');
  }}
  style={{
    position: 'absolute',
    right: 18,
    top: 15,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Text
    style={{
      color: colors.text,
      fontSize: 26,
      fontWeight: '300',
    }}
  >
    ×
  </Text>
</Pressable>


            {/* TASK INPUT */}

            <TextInput
              style={styles.taskInput}
              placeholder="Task enna?"
              placeholderTextColor="#71819B"
              value={taskName}
              onChangeText={setTaskName}
            />


            {/* ================= CATEGORY BUTTONS ================= */}

            <View style={styles.categoryContainer}>

              {/* HEALTH */}

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === 'Health' &&
                    styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory('Health')}
              >

                <Text style={styles.categoryText}>
                  💪 Health
                </Text>

              </Pressable>


              {/* WORK */}

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === 'Work' &&
                    styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory('Work')}
              >

                <Text style={styles.categoryText}>
                  💼 Work
                </Text>

              </Pressable>


              {/* STUDY */}

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === 'Study' &&
                    styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory('Study')}
              >

                <Text style={styles.categoryText}>
                  📚 Study
                </Text>

              </Pressable>


              {/* HOME */}

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === 'Home' &&
                    styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory('Home')}
              >

                <Text style={styles.categoryText}>
                  🏠 Home
                </Text>

              </Pressable>


              {/* PERSONAL */}

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === 'Personal' &&
                    styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory('Personal')}
              >

                <Text style={styles.categoryText}>
                  🌸 Personal
                </Text>

              </Pressable>

            </View>


            {/* ================= TIME + DATE ================= */}

            <View style={styles.dateRow}>

              {/* TIME */}

              <View style={styles.dateBox}>

                <Text style={styles.dateText}>
                  09:00
                </Text>

                <Text style={styles.dateIcon}>
                  ◷
                </Text>

              </View>


              {/* DATE */}

              <View style={styles.dateBox}>

                <Text style={styles.dateText}>
                  01-10-2026
                </Text>

                <Text style={styles.dateIcon}>
                  □
                </Text>

              </View>

            </View>


            {/* ================= ADD TASK ================= */}

            <Pressable
              style={styles.addTaskButton}
              onPress={addTask}
            >

              <Text style={styles.addTaskText}>
                Add task
              </Text>

            </Pressable>

          </View>

        </View>

      )}

    </SafeAreaView>
  );
}


const createStyles = (colors: ThemeColors) => StyleSheet.create({

  /* ================= SCREEN ================= */

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },


  /* ================= STATUS BAR ================= */

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


  /* ================= SIGNAL ================= */

  signal: {
    width: 12,
    height: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },

  signalBar: {
    width: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },


  /* ================= WIFI ================= */

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
    borderColor: '#FFFFFF',
    borderRadius: 10,
    top: 1,
    left: 1,
  },

  wifiMiddle: {
    position: 'absolute',
    width: 8,
    height: 5,
    borderTopWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    left: 3.5,
    top: 4,
  },

  wifiDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    left: 6,
    bottom: 0,
  },


  /* ================= BATTERY ================= */

  battery: {
    width: 16,
    height: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 2,
    padding: 1,
    position: 'relative',
  },

  batteryFill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },

  batteryTip: {
    position: 'absolute',
    right: -3,
    top: 2,
    width: 2,
    height: 4,
    backgroundColor: '#FFFFFF',
  },


  /* ================= CONTENT ================= */

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  pageTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 14,
  },


  /* ================= NAME CARD ================= */

  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 15,
    marginBottom: 13,
  },

  label: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 7,
  },

  nameInput: {
    height: 48,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },


  /* ================= OPTIONS ================= */

  optionCard: {
    minHeight: 66,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 14,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  optionValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },


  /* ================= CHANGE ================= */

  changeButton: {
    height: 37,
    paddingHorizontal: 17,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  changeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },


  /* ================= CLEAR ================= */

  clearButton: {
    height: 37,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },


  /* ================= VERSION ================= */

  version: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 9,
  },

  bottomSpace: {
    height: 120,
  },


  /* ================= FLOATING BUTTON ================= */

  floatingButton: {
    position: 'absolute',
    right: 18,
    bottom: 70,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#39C4C8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 7,
  },

  plus: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '300',
  },


  /* ================= BOTTOM NAV ================= */

  bottomNavigation: {
    height: 58,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: '#293B58',
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
  },

  activeIcon: {
    fontSize: 17,
    marginBottom: 2,
  },

  navText: {
    fontSize: 12,
    color: colors.muted,
  },

  activeNavText: {
    fontSize: 12,
    color: colors.accentStrong,
    fontWeight: '700',
  },


  /* ================================================= */
  /* ================= NEW TASK POPUP ================ */
  /* ================================================= */

  modalOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    backgroundColor: colors.overlay,

    justifyContent: 'flex-end',
  },

  newTaskCard: {
    backgroundColor: colors.card,

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 22,

    minHeight: 340,

    borderWidth: 1,
    borderColor: colors.border,
  },

  newTaskTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '700',
    marginBottom: 16,
  },

  taskInput: {
    height: 48,

    backgroundColor: colors.input,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 11,

    paddingHorizontal: 14,

    color: colors.text,

    fontSize: 13,

    marginBottom: 12,
  },

  /* ================= CATEGORY ================= */

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  categoryButton: {
    height: 39,

    paddingHorizontal: 14,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: colors.inputBorder,

    backgroundColor: colors.card,

    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedCategory: {
    height: 39,

    paddingHorizontal: 14,

    borderRadius: 20,

    backgroundColor: colors.accent,

    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },


  /* ================= TIME + DATE ================= */

  dateRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },

  dateBox: {
    flex: 1,

    height: 49,

    backgroundColor: colors.input,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 11,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 13,
  },

  dateText: {
    color: colors.text,
    fontSize: 13,
  },

  dateIcon: {
    color: colors.muted,
    fontSize: 17,
  },


  /* ================= ADD TASK ================= */

  addTaskButton: {
    height: 49,

    borderRadius: 11,

    backgroundColor: colors.accent,

    alignItems: 'center',
    justifyContent: 'center',
  },

  addTaskText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

});