import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getProfile, getPublicPictures, getSafePictures, type Profile } from "@borta/user-pictures";
import { colors, grid } from "./src/globals";
import { LoadingScreen } from "./src/components/LoadingScreen";
import { ErrorScreen } from "./src/components/ErrorScreen";
import { ProfileHeader } from "./src/components/ProfileHeader";
import { PhotoGrid } from "./src/components/PhotoGrid";
import { StatsSection } from "./src/components/StatsSection";

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = () => {
    getProfile()
      .then(setProfile)
      .catch((err: Error) => setError(err.message));
  };

  const retry = () => {
    setError(null);
    setProfile(null);
    loadProfile();
  };

  useEffect(loadProfile, []);

  const safePictures = profile ? getSafePictures(profile) : [];
  const publicPictures = profile ? getPublicPictures(profile) : [];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        {error ? (
          <ErrorScreen message={error} onRetry={retry} />
        ) : !profile ? (
          <LoadingScreen />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <ProfileHeader name={profile.name} headline={profile.headline} profileId={profile.id} />
            <PhotoGrid pictures={safePictures} />
            <StatsSection
              stats={[
                { value: safePictures.length, label: "Safe Photos" },
                { value: publicPictures.length, label: "Public Photos" },
                { value: profile.pictures.length, label: "Total Photos" },
              ]}
            />
          </ScrollView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: grid.padding,
    paddingTop: 48,
  },
});
