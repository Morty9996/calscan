import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CameraView as ExpoCameraView } from "expo-camera";

/**
 * Camera screen component
 * Allows user to take a photo of their food
 * @param {Object} cameraRef - Reference to the camera component
 * @param {Function} onClose - Callback when user closes camera
 * @param {Function} onCapture - Callback when user takes a photo
 */
export default function CameraView({ cameraRef, onClose, onCapture }) {
  return (
    <View className="flex-1 bg-black">
      {/* Full-screen camera view */}
      <ExpoCameraView style={StyleSheet.absoluteFill} ref={cameraRef} />

      {/* Top bar with close button */}
      <SafeAreaView className="absolute top-0 left-0 right-0">
        <View className="flex-row justify-between items-center px-6 py-4">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <View className="bg-black/50 px-4 py-2 rounded-full">
            <Text className="text-white font-semibold">Camera</Text>
          </View>
          {/* Spacer for centering */}
          <View className="w-10" />
        </View>
      </SafeAreaView>

      {/* Visual guide frame to help position food */}
      <View className="absolute inset-0 items-center justify-center pointer-events-none">
        <View className="w-[280px] h-[280px] border-4 border-white/80 rounded-3xl" />
        <Text className="absolute top-[40%] text-white font-semibold text-center px-8">
          Position your meal in the frame
        </Text>
      </View>

      {/* Capture button at bottom */}
      <View className="absolute bottom-0 left-0 right-0 pb-12 items-center">
        <TouchableOpacity
          className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 items-center justify-center shadow-2xl"
          onPress={onCapture}
          activeOpacity={0.8}
        >
          <View className="w-16 h-16 rounded-full bg-white border-2 border-gray-200" />
        </TouchableOpacity>
        <Text className="text-white mt-4 font-semibold text-base">
          Tap to capture
        </Text>
      </View>
    </View>
  );
}

