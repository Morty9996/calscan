import React from "react";
import { Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import StatBox from "./StatBox";

/**
 * Results screen component
 * Displays the captured photo and AI-analyzed nutrition information
 * @param {string} photo - URI of the captured photo
 * @param {Object} nutrition - Nutrition data from AI (food, calories, protein, sugar)
 * @param {boolean} loading - Whether AI analysis is in progress
 * @param {Function} onBack - Callback to go back to dashboard
 * @param {Function} onScanAnother - Callback to scan another meal
 */
export default function ResultsView({
  photo,
  nutrition,
  loading,
  onBack,
  onScanAnother,
}) {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header section with circular food image */}
      <View className="h-[45%] bg-gray-900 rounded-b-[60px] items-center justify-center relative">
        <View className="absolute inset-0 bg-black/20" />
        
        {/* Circular food image */}
        <Image
          source={{ uri: photo }}
          className="w-[240px] h-[240px] rounded-[120px] absolute bottom-[-70px] border-8 border-white shadow-2xl"
          style={{ zIndex: 10 }}
        />
        
        {/* Back button */}
        <View className="absolute top-12 left-6">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center"
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 mt-[90px] px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Food name and description */}
        <View className="items-center mb-6">
          {loading ? (
            // Loading state
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#2563eb" />
              <Text className="text-xl font-bold text-gray-800 mt-4">
                Analyzing...
              </Text>
              <Text className="text-gray-500 text-center mt-2 text-sm">
                Our AI is calculating the nutritional values
              </Text>
            </View>
          ) : (
            // Results state
            <>
              <Text className="text-3xl font-extrabold text-gray-800 text-center mb-2">
                {nutrition?.food || "Unknown Food"}
              </Text>
              <View className="bg-blue-50 rounded-full px-4 py-1.5 mb-3 flex-row items-center">
                <MaterialIcons name="auto-awesome" size={14} color="#1d4ed8" />
                <Text className="text-blue-700 font-semibold text-xs ml-1">
                  AI-Powered Analysis
                </Text>
              </View>
              <Text className="text-gray-600 text-center text-sm leading-5 px-4">
                Freshly scanned meal with estimated nutritional values based on
                portion size
              </Text>
            </>
          )}
        </View>

        {/* Nutrition stats grid */}
        {!loading && nutrition && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Nutritional Information
            </Text>
            <View className="flex-row justify-between mb-4">
              <StatBox
                label="Calories"
                value={nutrition?.calories}
                iconName="flame"
                color="orange"
              />
              <StatBox
                label="Protein"
                value={nutrition?.protein}
                color="blue"
              />
              <StatBox label="Sugars" value={nutrition?.sugar} color="pink" />
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View className="pb-8">
          {/* Complete scan button */}
          <TouchableOpacity
            className="bg-blue-600 h-14 rounded-2xl justify-center items-center mb-4 shadow-lg shadow-blue-500/30"
            onPress={onBack}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white text-lg font-bold ml-2">
                Scan Complete
              </Text>
            </View>
          </TouchableOpacity>

          {/* Scan another meal button */}
          <TouchableOpacity
            className="bg-white border-2 border-gray-200 h-14 rounded-2xl justify-center items-center"
            onPress={onScanAnother}
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 font-semibold">
              Scan Another Meal
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

