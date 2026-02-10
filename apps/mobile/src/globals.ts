import { Dimensions } from "react-native";

export const colors = {
  background: "#071A0F",
  backgroundSecondary: "#0D2818",
  foreground: "#ECFDF5",
  foregroundSecondary: "#6EE7B7",
  muted: "#5D9B7C",
  border: "#166534",
  cardBg: "#0C3B21",
  cardHover: "#15503A",
};

export const grid = {
  columns: 2,
  gap: 8,
  padding: 16,
  columnWidth: (Dimensions.get("window").width - 16 * 2 - 8) / 2,
};
