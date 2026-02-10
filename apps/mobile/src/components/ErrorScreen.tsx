import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../globals";

type Props = {
  message: string;
  onRetry: () => void;
};

export function ErrorScreen({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  title: {
    color: colors.foreground,
    fontSize: 22,
    fontWeight: "bold",
  },
  message: {
    color: colors.foregroundSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: "600",
  },
});
