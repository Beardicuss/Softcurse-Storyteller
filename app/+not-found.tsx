import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { cyberpunk } from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>🌀</Text>
        <Text style={styles.title}>This realm doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return to Olymp-Po</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: cyberpunk.bg,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: cyberpunk.textPrimary,
  },
  link: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cyberpunk.borderGlow,
    backgroundColor: "rgba(0, 255, 255, 0.06)",
  },
  linkText: {
    fontSize: 14,
    color: cyberpunk.cyan,
    fontWeight: "600",
  },
});