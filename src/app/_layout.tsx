import React from 'react';
import { Stack } from 'expo-router';
import { TaskProvider } from '../context/TaskContext';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TaskProvider>
    </ThemeProvider>
  );
}
