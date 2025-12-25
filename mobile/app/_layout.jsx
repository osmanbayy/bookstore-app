/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // handle the navigation based on the auth state
  useEffect(() => {
    const isAuthSegment = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !isAuthSegment) {
      // Redirect to the sign-in page
      router.replace("/(auth)");
    } else if (isSignedIn && isAuthSegment) {
      // Redirect to the main app
      router.replace("/(tabs)");
    }
  }, [user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
