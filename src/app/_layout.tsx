import { Stack } from "expo-router";
import React from "react";
import { ScoreProvider } from "./lib/utils/userCourses"; // adjust path as needed

export default function RootLayout() {
  return (
    <ScoreProvider>
      <Stack />
    </ScoreProvider>
  );
}
