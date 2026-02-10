import { StyleSheet, Text, View } from "react-native";
import { colors } from "../globals";

type Props = {
  name: string;
  headline?: string;
  profileId: string;
};

export function ProfileHeader({ name, headline, profileId }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      {headline && <Text style={styles.headline}>{headline}</Text>}
      <Text style={styles.profileId}>Profile ID: {profileId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
  },
  name: {
    color: colors.foreground,
    fontSize: 28,
    fontWeight: "bold",
  },
  headline: {
    color: colors.foregroundSecondary,
    fontSize: 16,
    marginTop: 4,
  },
  profileId: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
});
