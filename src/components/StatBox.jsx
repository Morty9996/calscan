import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

/**
 * Reusable component for displaying nutrition statistics
 * @param {string} label - Stat label (e.g., "Calories", "Protein")
 * @param {string|number} value - Stat value to display
 * @param {string} iconName - Icon name for Ionicons (optional)
 * @param {string} color - Color theme: "orange", "blue", or "pink" (default: "blue")
 */
export default function StatBox({ label, value, iconName, color = "blue" }) {
  // Color theme mappings for backgrounds and borders
  const colorClasses = {
    orange: "bg-orange-50 border-orange-200",
    blue: "bg-blue-50 border-blue-200",
    pink: "bg-pink-50 border-pink-200",
  };

  // Icon color mappings
  const iconColors = {
    orange: "#ea580c",
    blue: "#2563eb",
    pink: "#db2777",
  };

  // Default icons for each stat type
  const iconMap = {
    Calories: "flame",
    Protein: "barbell-outline",
    Sugars: "water-outline",
  };

  // Determine which icon to use
  const icon = iconName || iconMap[label] || "analytics-outline";
  const iconColor = iconColors[color] || iconColors.blue;
  const bgColor = colorClasses[color] || colorClasses.blue;

  return (
    <View
      className={`w-[30%] p-4 rounded-2xl items-center border-2 shadow-sm ${bgColor}`}
    >
      {/* Icon display - Protein uses FontAwesome5, others use Ionicons */}
      <View className="mb-2">
        {label === "Protein" ? (
          <FontAwesome5 name="dumbbell" size={24} color={iconColor} />
        ) : (
          <Ionicons name={icon} size={28} color={iconColor} />
        )}
      </View>
      
      {/* Label */}
      <Text className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">
        {label}
      </Text>
      
      {/* Value - shows "--" if no value provided */}
      <Text className="text-lg font-extrabold text-gray-800">
        {value || "--"}
      </Text>
    </View>
  );
}

