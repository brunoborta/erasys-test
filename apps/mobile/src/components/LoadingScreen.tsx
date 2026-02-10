import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../globals";

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.foregroundSecondary} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  text: {
    color: colors.muted,
    fontSize: 16,
  },
});
