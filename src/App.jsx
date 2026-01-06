import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

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

  const analyzeImage = async (base64) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash-lite",
      });
      const prompt =
        'Identify food. Return strictly JSON (if image is not food reurn the identified object nae with other valures nulled feeel free to be funny in that case just be very short): { "food": "Name", "calories": 564, "sugar": "2.8g", "protein": "33.3g" }';
      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64, mimeType: "image/jpeg" } },
      ]);
      const data = JSON.parse(
        result.response
          .text()
          .replace(/```json|```/g, "")
          .trim()
      );

      setNutrition(data);
      setHistory((prev) => [{ ...data, uri: photo }, ...prev]);
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
      analyzeImage(data.base64);
    }
  };

  // --- UI: DASHBOARD ---
  if (!showCamera && !photo) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8F9FB] px-5">
        <View className="flex-row justify-between items-center py-5">
          <Text className="text-3xl font-extrabold text-[#185A9F]">
            NutriScan
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="items-stretch mb-5">
            <Image
              source={require("./assets/images/hero.png")}
              className="h-[220px]"
              style={{
                width: "auto",
                objectFit: "contain",
              }}
            />
          </View>

          <TouchableOpacity
            className="p-2.5 items-center my-5"
            onPress={() => setShowCamera(true)}
          >
            <View className="w-[120px] h-[120px] rounded-full overflow-hidden justify-center items-center mb-5">
              <Image
                source={require("./assets/images/camera.png")}
                className="w-[140px] h-[140px]"
                style={{ objectFit: "cover" }}
              />
            </View>
            <Text className="text-xl font-bold">Scan Your Meal</Text>
            <Text className="text-[#185A9F] font-semibold mt-1.5">
              Click to open camera
            </Text>
          </TouchableOpacity>

          <Text className="text-lg font-bold my-4">Recently Added</Text>
          {history.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center bg-white p-4 rounded-[20px] mb-4"
            >
              <Image
                source={{ uri: item.uri }}
                className="w-[50px] h-[50px] rounded-[15px] mr-4"
              />
              <View>
                <Text className="font-bold text-base">{item.food}</Text>
                <Text className="text-gray-500 text-[13px]">
                  {item.calories} kcal
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- UI: CAMERA ---
  if (showCamera) {
    return (
      <View className="flex-1 bg-[#F8F9FB]">
        <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />
        <TouchableOpacity
          className="absolute bottom-[50px] self-center w-20 h-20 rounded-[20px] bg-white/30 p-1.5"
          onPress={takePicture}
        >
          <View className="flex-1 rounded-[40px] bg-white" />
        </TouchableOpacity>
      </View>
    );
  }

  // --- UI: DETAIL VIEW (Matches your image) ---
  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <View className="h-[40%] bg-[#1A1D1E] rounded-b-[50px] items-center justify-center">
        <Image
          source={{ uri: photo }}
          className="w-[220px] h-[220px] rounded-[110px] absolute bottom-[-50px]"
        />
      </View>

      <View className="flex-1 mt-[70px] px-[30px]">
        <Text className="text-[28px] font-bold text-center">
          {nutrition?.food || "Analyzing..."}
        </Text>
        <Text className="text-gray-500 text-center mt-2.5 leading-5">
          {loading
            ? "Our AI is calculating the macros..."
            : "Freshly scanned meal with estimated nutritional values based on portion size."}
        </Text>

        <View className="flex-row justify-between mt-[30px]">
          <StatBox label="Calories" value={nutrition?.calories} />
          <StatBox label="Sugars" value={nutrition?.sugar} />
          <StatBox label="Protein" value={nutrition?.protein} />
        </View>

        <TouchableOpacity
          className="bg-[#185A9F] h-[60px] rounded-[10px] justify-center items-center mt-auto mb-[30px]"
          onPress={() => {
            setPhoto(null);
            setNutrition(null);
          }}
        >
          <Text className="text-white text-[18px] font-bold">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const StatBox = ({ label, value }) => (
  <View className="w-[30%] p-4 bg-white rounded-[20px] items-center border border-[#F1F2F6]">
    <Text className="text-[12px] text-gray-500">{label}</Text>
    <Text className="text-base font-bold my-1">{value || "--"}</Text>
  </View>
);
