import React from "react";
import { Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

/**
 * Component for displaying a single item in the scan history
 * Shows thumbnail, food name, and key nutrition stats
 * @param {Object} item - History item with food data and image URI
 * @param {number} index - Index in the history array (for React key)
 */
export default function HistoryItem({ item, index }) {
  return (
    <View
      key={index}
      className="flex-row items-center bg-white p-4 rounded-2xl mb-4 shadow-md shadow-gray-200/50 border border-gray-100"
    >
      {/* Food image thumbnail */}
      <View className="relative">
        <Image
          source={{ uri: item.uri }}
          className="w-[60px] h-[60px] rounded-xl mr-4"
          resizeMode="cover"
          onError={(error) =>
            console.log("Image loading error:", error.nativeEvent.error)
          }
        />
        {/* Green indicator dot */}
        <View className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      </View>

      {/* Food info */}
      <View className="flex-1">
        <Text className="font-bold text-base text-gray-800 mb-1">
          {item.food}
        </Text>
        
        {/* Nutrition stats */}
        <View className="flex-row items-center">
          {/* Calories badge */}
          <View className="bg-blue-50 px-2 py-1 rounded-lg mr-2 flex-row items-center">
            <Ionicons name="flame" size={12} color="#dc2626" />
            <Text className="text-blue-700 font-semibold text-xs ml-1">
              {item.calories} kcal
            </Text>
          </View>
          
          {/* Protein (if available) */}
          {item.protein && (
            <View className="flex-row items-center">
              <FontAwesome5 name="dumbbell" size={10} color="#6b7280" />
              <Text className="text-gray-500 text-xs ml-1">
                {item.protein}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Checkmark indicator */}
      <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
        <Ionicons name="checkmark" size={18} color="#2563eb" />
      </View>
    </View>
  );
}

