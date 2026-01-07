import React from "react";
import { Text, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

/**
 * App header component with logo and title
 * Displays at the top of the dashboard screen
 */
export default function Header() {
  return (
    <View className="px-6 pt-6 pb-6 bg-white/80 rounded-b-3xl shadow-md">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          {/* Logo icon */}
          <View className="bg-blue-600 rounded-2xl p-3 mr-3 shadow-lg">
            <Ionicons name="restaurant" size={28} color="white" />
          </View>
          
          {/* App title and subtitle */}
          <View>
            <Text className="text-4xl font-extrabold text-blue-700">
              NutriScan
            </Text>
            <View className="flex-row items-center mt-1">
              <MaterialIcons
                name="auto-awesome"
                size={14}
                color="#6366f1"
              />
              <Text className="text-gray-600 text-sm ml-1">
                AI-powered nutrition tracking
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

