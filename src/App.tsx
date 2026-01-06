import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { CameraView, useCameraPermissions } from "expo-camera";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyByzLQfV4qzOcMOeH8noYBiduNm0s6d_qU");

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [history, setHistory] = useState([]);
  const cameraRef = useRef(null);

  if (!permission) return <View />;

  const analyzeImage = async (base64: string) => {
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
      <SafeAreaView style={styles.dashboard}>
        <View style={styles.header}>
          <Text style={styles.title}>NutriScan</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.heroContainer}>
            <Image
              source={require("./assets/images/hero.png")}
              style={{
                width: "auto",
                height: 220,
                objectFit: "contain",
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.mainCard}
            onPress={() => setShowCamera(true)}
          >
            <View style={styles.imageCircle}>
              <Image
                source={require("./assets/images/camera.png")}
                style={{ width: 140, height: 140, objectFit: "cover" }}
              />
            </View>
            <Text style={styles.cardTitle}>Scan Your Meal</Text>
            <Text style={styles.cardPrice}>Click to open camera</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>Recently Added</Text>
          {history.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Image source={{ uri: item.uri }} style={styles.historyImg} />
              <View>
                <Text style={styles.historyName}>{item.food}</Text>
                <Text style={styles.historyDetail}>{item.calories} kcal</Text>
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
      <View style={styles.container}>
        <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />
        <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>
    );
  }

  // --- UI: DETAIL VIEW (Matches your image) ---
  return (
    <View style={styles.container}>
      <View style={styles.detailHeader}>
        <Image source={{ uri: photo }} style={styles.foodImageHero} />
      </View>

      <View style={styles.detailContent}>
        <Text style={styles.detailFoodName}>
          {nutrition?.food || "Analyzing..."}
        </Text>
        <Text style={styles.detailDesc}>
          {loading
            ? "Our AI is calculating the macros..."
            : "Freshly scanned meal with estimated nutritional values based on portion size."}
        </Text>

        <View style={styles.statsRow}>
          <StatBox label="Calories" value={nutrition?.calories} />
          <StatBox label="Sugars" value={nutrition?.sugar} />
          <StatBox label="Protein" value={nutrition?.protein} />
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            setPhoto(null);
            setNutrition(null);
          }}
        >
          <Text style={styles.actionBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const StatBox = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value || "--"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  dashboard: { flex: 1, backgroundColor: "#F8F9FB", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: { fontSize: 32, fontWeight: "800", color: "#185A9F" },

  heroContainer: {
    alignItems: "stretch",
    marginBottom: 20,
  },
  mainCard: {
    padding: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  imageCircle: {
    width: 120,
    height: 120,
    borderRadius: 600,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold" },
  cardPrice: { color: "#185A9F", fontWeight: "600", marginTop: 5 },

  sectionLabel: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  historyImg: { width: 50, height: 50, borderRadius: 15, marginRight: 15 },
  historyName: { fontWeight: "bold", fontSize: 16 },
  historyDetail: { color: "#888", fontSize: 13 },
  addBtn: {
    marginLeft: "auto",
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },

  // Detail View
  detailHeader: {
    height: "40%",
    backgroundColor: "#1A1D1E",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  foodImageHero: {
    width: 220,
    height: 220,
    borderRadius: 110,
    position: "absolute",
    bottom: -50,
  },
  detailContent: { flex: 1, marginTop: 70, paddingHorizontal: 30 },
  detailFoodName: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  detailDesc: {
    color: "#888",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  statBox: {
    width: "30%",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F2F6",
  },
  statLabel: { fontSize: 12, color: "#888" },
  statValue: { fontSize: 16, fontWeight: "bold", marginVertical: 4 },
  statPercent: { fontSize: 12, fontWeight: "bold" },

  actionBtn: {
    backgroundColor: "#185A9F",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 30,
  },
  actionBtnText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },

  // Camera
  captureBtn: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 5,
  },
  captureInner: { flex: 1, borderRadius: 40, backgroundColor: "#FFF" },
});
