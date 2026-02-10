import { StyleSheet, Text, View } from "react-native";
import { colors } from "../globals";

type Stat = {
  value: number;
  label: string;
};

type Props = {
  stats: Stat[];
};

export function StatsSection({ stats }: Props) {
  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.card}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  value: {
    color: colors.foreground,
    fontSize: 22,
    fontWeight: "bold",
  },
  label: {
    color: colors.foregroundSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
