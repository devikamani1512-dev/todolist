import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Pressable,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  const [name, setName] = useState('');

  const handleStart = async () => {
    const trimmedName = name.trim();

    if (trimmedName === '') {
      return;
    }

    try {
      await AsyncStorage.setItem(
        '@todo_user_name',
        trimmedName
      );

      router.replace('/tasks');
    } catch (error) {
      console.log(
        'Failed to save onboarding name',
        error
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <LinearGradient
        colors={[
          '#FFD9A0',
          '#FFB3A7',
          '#8AA4FF',
        ]}
        locations={[0, 0.48, 1]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <View style={styles.content}>

            {/* =========================
                REALISTIC NATURE IMAGE
               ========================= */}

            <View style={styles.imageContainer}>
              <Image
                source={require(
                  '../../assets/images/dayflow-onboarding.png'
                )}
                style={styles.onboardingImage}
                resizeMode="cover"
              />
            </View>

            {/* =========================
                APP NAME
               ========================= */}

            <Text style={styles.title}>
              DayFlow
            </Text>

            {/* =========================
                DESCRIPTION
               ========================= */}

            <Text style={styles.description}>
              Plan and track your daily activities
              from morning to night.
            </Text>

            {/* =========================
                NAME INPUT
               ========================= */}

            <TextInput
              style={styles.input}
              placeholder="What's your name?"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
              maxLength={30}
            />

            {/* =========================
                START BUTTON
               ========================= */}

            <Pressable
              style={[
                styles.startButton,
                name.trim() === '' &&
                  styles.disabledButton,
              ]}
              onPress={handleStart}
            >
              <Text style={styles.startButtonText}>
                Start my day
              </Text>
            </Pressable>

          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#8AA4FF',
  },

  container: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  imageContainer: {
    width: '100%',
    height: 245,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10,
  },

  onboardingImage: {
    width: '100%',
    height: '100%',
  },

  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#14213D',
    marginBottom: 12,
    letterSpacing: -1,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#14213D',
    opacity: 0.85,
    marginBottom: 20,
  },

  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#14213D',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#14213D',
    marginBottom: 12,
  },

  startButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#14213D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.7,
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});