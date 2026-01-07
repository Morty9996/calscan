import React, { useState, useRef } from "react";
import { View, Alert } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { analyzeImage } from "./utils/aiService";
import DashboardView from "./components/DashboardView";
import CameraView from "./components/CameraView";
import ResultsView from "./components/ResultsView";

/**
 * Main App Component
 * Manages app state and navigation between screens (Dashboard, Camera, Results)
 */
export default function App() {
  // Camera permission state
  const [permission, requestPermission] = useCameraPermissions();

  // Photo and analysis state
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null);

  // Navigation state
  const [showCamera, setShowCamera] = useState(false);

  // History state - stores all previous scans
  const [history, setHistory] = useState([]);

  // Reference to camera component (needed to take pictures)
  const cameraRef = useRef(null);

  // Show loading screen while checking permissions
  if (!permission) {
    return <View className="flex-1" />;
  }

  /**
   * Handles the AI image analysis process
   * Called after a photo is taken
   */
  const handleAnalyzeImage = async (imageData) => {
    setLoading(true);
    try {
      // Call AI service to analyze the image
      const data = await analyzeImage(imageData);

      // Update state with nutrition data
      setNutrition(data);

      // Add to history (newest first)
      setHistory((prev) => [{ ...data, uri: imageData.uri }, ...prev]);
    } catch (err) {
      console.error("Analysis Error:", err);
      Alert.alert("Error", "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Captures a photo from the camera
   * Called when user taps the capture button
   */
  const takePicture = async () => {
    if (cameraRef.current) {
      // Take picture with base64 encoding (needed for AI)
      const data = await cameraRef.current.takePictureAsync({
        quality: 0.8, // 80% quality - balance between size and quality
        base64: true, // Include base64 for AI analysis
      });

      // Save photo URI and hide camera
      setPhoto(data.uri);
      setShowCamera(false);

      // Start AI analysis
      handleAnalyzeImage(data);
    }
  };

  /**
   * Resets the results view and returns to dashboard
   */
  const handleBackToDashboard = () => {
    setPhoto(null);
    setNutrition(null);
  };

  /**
   * Opens camera for a new scan
   */
  const handleScanAnother = () => {
    setShowCamera(true);
  };

  /**
   * Opens camera from dashboard
   */
  const handleStartScan = () => {
    setShowCamera(true);
  };

  /**
   * Closes camera and returns to dashboard
   */
  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  // Conditional rendering based on app state
  // Shows different screens based on current state

  // Dashboard view - shown when camera is closed and no photo is displayed
  if (!showCamera && !photo) {
    return <DashboardView onScanPress={handleStartScan} history={history} />;
  }

  // Camera view - shown when user wants to take a photo
  if (showCamera) {
    return (
      <CameraView
        cameraRef={cameraRef}
        onClose={handleCloseCamera}
        onCapture={takePicture}
      />
    );
  }

  // Results view - shown after photo is taken (while loading or showing results)
  return (
    <ResultsView
      photo={photo}
      nutrition={nutrition}
      loading={loading}
      onBack={handleBackToDashboard}
      onScanAnother={handleScanAnother}
    />
  );
}
