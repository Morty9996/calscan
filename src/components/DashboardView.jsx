import React from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "./Header";
import HistoryItem from "./HistoryItem";

/**
 * Main dashboard screen component
 * Shows welcome section, camera button, and scan history
 * @param {Function} onScanPress - Callback when user taps scan button
 * @param {Array} history - Array of previous scan results
 */
export default function DashboardView({ onScanPress, history }) {
  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      {/* App header */}
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6"
      >
        {/* Hero section with welcome message */}
        <View className="items-center mb-8 mt-6">
          <View className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-300/30 w-full border border-blue-100/50">
            <View className="items-center">
              <Image
                source={require("../assets/images/hero.png")}
                className="h-[180px] w-full"
                resizeMode="contain"
                style={{ width: "100%" }}
              />
              <Text className="text-center text-gray-800 mt-4 text-lg font-bold leading-6 mb-2">
                Instant Nutrition Analysis
              </Text>
              <Text className="text-center text-gray-600 text-sm leading-5">
                Scan your meals instantly and get detailed nutritional
                information powered by AI
              </Text>
            </View>
          </View>
        </View>

        {/* Main camera button */}
        <TouchableOpacity
          className="items-center mb-8"
          onPress={onScanPress}
          activeOpacity={0.8}
        >
          <View className="w-[140px] h-[140px] rounded-full justify-center items-center mb-6 shadow-xl shadow-blue-500/40 bg-blue-600 border-4 border-white">
            <Ionicons name="camera" size={70} color="white" />
            {/* Green status indicator */}
            <View className="absolute top-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </View>
          <View className="bg-white rounded-2xl px-8 py-4 shadow-lg shadow-blue-200/50 min-w-[200px] items-center border border-blue-100">
            <Text className="text-2xl font-bold text-gray-800 mb-1">
              Scan Your Meal
            </Text>
            <View className="flex-row items-center">
              <Text className="text-blue-600 font-semibold text-base">
                Tap to start
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#2563eb"
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* History section */}
        {history.length > 0 && (
          <>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Recent Scans
              </Text>
              <Text className="text-sm text-gray-500">
                {history.length} item{history.length !== 1 ? "s" : ""}
              </Text>
            </View>
            
            {/* Render each history item */}
            {history.map((item, index) => (
              <HistoryItem key={index} item={item} index={index} />
            ))}
          </>
        )}

        {/* Empty state - shown when no scans yet */}
        {history.length === 0 && (
          <View className="items-center py-12">
            <View className="bg-blue-100 rounded-full p-6 mb-4">
              <Ionicons name="camera-outline" size={48} color="#2563eb" />
            </View>
            <Text className="text-gray-500 text-center text-base">
              No scans yet. Start by scanning your first meal!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

