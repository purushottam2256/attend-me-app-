import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ZenToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  type?: "success" | "error" | "warning";
}

export const ZenToast: React.FC<ZenToastProps> = ({
  message,
  visible,
  onHide,
  type = "success",
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case "error":
        return "alert-circle";
      case "warning":
        return "warning";
      default:
        return "checkmark-circle";
    }
  };

  const getColor = () => {
    switch (type) {
      case "error":
        return "#EF4444";
      case "warning":
        return "#F59E0B";
      default:
        return "#0F766E";
    }
  };

  return (
    <View style={styles.toastContainer}>
      <View
        style={[
          styles.toastContent,
          { borderLeftColor: getColor(), borderLeftWidth: 4 },
        ]}
      >
        <Ionicons name={getIcon()} size={20} color={getColor()} />
        <Text style={[styles.toastText, { color: getColor() }]}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: "center",
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    gap: 12,
    width: "100%",
  },
  toastText: {
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
});
