import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import { CameraView, useCameraPermissions } from "expo-camera";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [history, setHistory] = useState([]);
  const cameraRef = useRef(null);

  if (!permission) return <View className="flex-1" />;

  const analyzeImage = async (imageData) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({
        model: "models/gemini-3-flash-preview",
      });
      const prompt =
        'Identify food and count nutritional values. if possible be precise with the values and quantity. Return strictly JSON: { "food": "Name", "calories": 564, "sugar": "2.8g", "protein": "33.3g" }. (if image is not food reurn the identified object nae with other valures nulled feeel free to be funny in that case just be very short)';
      const result = await model.generateContent([
        prompt,
        { inlineData: { data: imageData.base64, mimeType: "image/jpeg" } },
      ]);
      const data = JSON.parse(
        result.response
          .text()
          .replace(/```json|```/g, "")
          .trim()
      );

      setNutrition(data);
      setHistory((prev) => [{ ...data, uri: imageData.uri }, ...prev]);
    } catch (err) {
      console.error("Analysis Error:", err);
      Alert.alert("Error", "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      setPhoto(data.uri);
      setShowCamera(false);
      analyzeImage(data);
    }
  };

  // --- UI: DASHBOARD ---
  if (!showCamera && !photo) {
    return (
      <SafeAreaView className="flex-1 bg-blue-50">
        <View className="px-6 pt-6 pb-6 bg-white/80 rounded-b-3xl shadow-md">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <View className="bg-blue-600 rounded-2xl p-3 mr-3 shadow-lg">
                <Ionicons name="restaurant" size={28} color="white" />
              </View>
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6"
        >
          {/* Hero Section */}
          <View className="items-center mb-8 mt-6">
            <View className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-300/30 w-full border border-blue-100/50">
              <View className="items-center">
                <Image
                  source={require("./assets/images/hero.png")}
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

          {/* Main Action Button */}
          <TouchableOpacity
            className="items-center mb-8"
            onPress={() => setShowCamera(true)}
            activeOpacity={0.8}
          >
            <View className="w-[140px] h-[140px] rounded-full justify-center items-center mb-6 shadow-xl shadow-blue-500/40 bg-blue-600 border-4 border-white">
              <Ionicons name="camera" size={70} color="white" />
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

          {/* History Section */}
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
              {history.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center bg-white p-4 rounded-2xl mb-4 shadow-md shadow-gray-200/50 border border-gray-100"
                >
                  <View className="relative">
                    <Image
                      source={{ uri: item.uri }}
                      className="w-[60px] h-[60px] rounded-xl mr-4"
                      resizeMode="cover" // Added resizeMode for better image display
                      onError={(error) =>
                        console.log(
                          "Image loading error:",
                          error.nativeEvent.error
                        )
                      } // Added error handling
                    />
                    <View className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base text-gray-800 mb-1">
                      {item.food}
                    </Text>
                    <View className="flex-row items-center">
                      <View className="bg-blue-50 px-2 py-1 rounded-lg mr-2 flex-row items-center">
                        <Ionicons name="flame" size={12} color="#dc2626" />
                        <Text className="text-blue-700 font-semibold text-xs ml-1">
                          {item.calories} kcal
                        </Text>
                      </View>
                      {item.protein && (
                        <View className="flex-row items-center">
                          <FontAwesome5
                            name="dumbbell"
                            size={10}
                            color="#6b7280"
                          />
                          <Text className="text-gray-500 text-xs ml-1">
                            {item.protein}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                    <Ionicons name="checkmark" size={18} color="#2563eb" />
                  </View>
                </View>
              ))}
            </>
          )}

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

  // --- UI: CAMERA ---
  if (showCamera) {
    return (
      <View className="flex-1 bg-black">
        <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />

        {/* Top Bar */}
        <SafeAreaView className="absolute top-0 left-0 right-0">
          <View className="flex-row justify-between items-center px-6 py-4">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <View className="bg-black/50 px-4 py-2 rounded-full">
              <Text className="text-white font-semibold">Camera</Text>
            </View>
            <View className="w-10" />
          </View>
        </SafeAreaView>

        {/* Camera Guide Frame */}
        <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <View className="w-[280px] h-[280px] border-4 border-white/80 rounded-3xl" />
          <Text className="absolute top-[40%] text-white font-semibold text-center px-8">
            Position your meal in the frame
          </Text>
        </View>

        {/* Capture Button */}
        <View className="absolute bottom-0 left-0 right-0 pb-12 items-center">
          <TouchableOpacity
            className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 items-center justify-center shadow-2xl"
            onPress={takePicture}
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

  // --- UI: DETAIL VIEW (Matches your image) ---
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Image */}
      <View className="h-[45%] bg-gray-900 rounded-b-[60px] items-center justify-center relative">
        <View className="absolute inset-0 bg-black/20" />
        <Image
          source={{ uri: photo }}
          className="w-[240px] h-[240px] rounded-[120px] absolute bottom-[-70px] border-8 border-white shadow-2xl"
          style={{ zIndex: 10 }}
        />
        <View className="absolute top-12 left-6">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center"
            onPress={() => {
              setPhoto(null);
              setNutrition(null);
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 mt-[90px] px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Food Name and Description */}
        <View className="items-center mb-6">
          {loading ? (
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

        {/* Stats Grid */}
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

        {/* Action Buttons */}
        <View className="pb-8">
          <TouchableOpacity
            className="bg-blue-600 h-14 rounded-2xl justify-center items-center mb-4 shadow-lg shadow-blue-500/30"
            onPress={() => {
              setPhoto(null);
              setNutrition(null);
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white text-lg font-bold ml-2">
                Scan Complete
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white border-2 border-gray-200 h-14 rounded-2xl justify-center items-center"
            onPress={() => setShowCamera(true)}
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

const StatBox = ({ label, value, iconName, color = "blue" }) => {
  const colorClasses = {
    orange: "bg-orange-50 border-orange-200",
    blue: "bg-blue-50 border-blue-200",
    pink: "bg-pink-50 border-pink-200",
  };

  const iconColors = {
    orange: "#ea580c",
    blue: "#2563eb",
    pink: "#db2777",
  };

  const iconMap = {
    Calories: "flame",
    Protein: "barbell-outline",
    Sugars: "water-outline",
  };

  const icon = iconName || iconMap[label] || "analytics-outline";
  const iconColor = iconColors[color] || iconColors.blue;

  return (
    <View
      className={`w-[30%] p-4 rounded-2xl items-center border-2 shadow-sm ${
        colorClasses[color] || colorClasses.blue
      }`}
    >
      <View className="mb-2">
        {label === "Protein" ? (
          <FontAwesome5 name="dumbbell" size={24} color={iconColor} />
        ) : (
          <Ionicons name={icon} size={28} color={iconColor} />
        )}
      </View>
      <Text className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">
        {label}
      </Text>
      <Text className="text-lg font-extrabold text-gray-800">
        {value || "--"}
      </Text>
    </View>
  );
};
