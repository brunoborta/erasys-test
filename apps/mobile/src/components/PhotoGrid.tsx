import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import type { Picture } from "@borta/user-pictures";
import { buildImageUrl } from "@borta/user-pictures";
import { colors, grid } from "../globals";

type Props = {
  pictures: Picture[];
};

export function PhotoGrid({ pictures }: Props) {
  return (
    <FlatList
      data={pictures}
      keyExtractor={(item) => item.id}
      numColumns={grid.columns}
      scrollEnabled={false}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image
            source={{ uri: buildImageUrl(item.url_token) }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.caption}>
            <Text style={styles.dimensions}>
              {item.width} × {item.height}
            </Text>
            <Text style={styles.rating}>Rating: {item.rating}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: grid.gap,
  },
  row: {
    gap: grid.gap,
  },
  card: {
    width: grid.columnWidth,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
  },
  caption: {
    padding: 8,
    gap: 2,
  },
  dimensions: {
    color: colors.foreground,
    fontSize: 12,
    fontWeight: "600",
  },
  rating: {
    color: colors.muted,
    fontSize: 11,
  },
});
