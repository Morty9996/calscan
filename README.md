# NutriScan - AI-Powered Nutrition Scanner

A mobile app that uses artificial intelligence to analyze food photos and instantly provide nutritional information. Built with React Native, Expo, and Google's Gemini AI.

---

## 📖 Table of Contents

1. [What is This Project?](#what-is-this-project)
2. [Technologies & Libraries Used](#technologies--libraries-used)
3. [How to Run the Project](#how-to-run-the-project)
4. [Understanding the Core Technologies](#understanding-the-core-technologies)
5. [Project Structure](#project-structure)
6. [How AI Powers This App](#how-ai-powers-this-app)
7. [Components Explained](#components-explained)
8. [Styling with NativeWind](#styling-with-nativewind)
9. [Key Features](#key-features)
10. [Code Walkthrough](#code-walkthrough)
11. [Environment Variables](#environment-variables)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 What is This Project?

**NutriScan** is a mobile application that helps you track your nutrition by simply taking a photo of your food. The app uses Google's Gemini AI to:

- Identify what food is in the photo
- Calculate calories, protein, and sugar content
- Store a history of your scanned meals
- Display nutritional information in an easy-to-read format

**Perfect for beginners** because it demonstrates:
- How to build a mobile app with React Native
- How to integrate AI/LLM APIs
- How to use device cameras
- How to manage app state
- How to create beautiful UIs

---

## 📚 Technologies & Libraries Used

### Core Framework
- **React Native** (`react-native` v0.81.5) - Framework for building mobile apps
- **React** (`react` v19.1.0) - JavaScript library for building user interfaces
- **Expo** (`expo` v54.0.1) - Toolchain and platform for React Native apps

### AI & Machine Learning
- **@google/generative-ai** (`v0.24.1`) - Google's SDK for Gemini AI models

### Camera & Media
- **expo-camera** (`v17.0.10`) - Camera functionality for taking photos

### UI & Icons
- **@expo/vector-icons** (`v15.0.3`) - Icon library (Ionicons, MaterialIcons, FontAwesome5)
- **react-native-safe-area-context** (`v5.6.0`) - Handles safe areas (notches, status bars)

### Styling
- **NativeWind** (`v4.2.1`) - Tailwind CSS for React Native
- **tailwindcss** (`v3.4.19`) - Utility-first CSS framework

### Development Tools
- **babel-plugin-inline-dotenv** - Loads environment variables
- **eslint** - Code linting
- **prettier** - Code formatting

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js installed (v18 or higher recommended)
- npm or yarn package manager
- Expo Go app on your phone (iOS/Android) OR
- iOS Simulator (Mac only) OR
- Android Emulator

### Step-by-Step Setup

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_AI_API_KEY=your_api_key_here
   ```
   Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Start the Development Server**
   ```bash
   npm start
   # or
   yarn start
   # or
   npx expo start
   ```

4. **Run on Your Device**
   - **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
   - **Android Emulator**: Press `a` in the terminal or run `npm run android`
   - **Physical Device**: 
     - Install Expo Go app from App Store/Play Store
     - Scan the QR code shown in the terminal with your phone's camera (iOS) or Expo Go app (Android)

5. **Web Browser** (optional)
   ```bash
   npm run web
   # or press 'w' in the terminal
   ```

---

## 🧠 Understanding the Core Technologies

### What is React?

React is a JavaScript library for building user interfaces. Think of it like building blocks:

- **Components**: Reusable pieces of UI (like a button, a card, or a screen)
- **State**: Data that can change (like a photo, loading status, or nutrition info)
- **Props**: Data passed from parent to child components

**Example from our code:**
```jsx
// This is a component
const StatBox = ({ label, value, iconName, color = "blue" }) => {
  // label, value, iconName, color are "props" (data passed in)
  return (
    <View>
      <Text>{label}</Text>
      <Text>{value}</Text>
    </View>
  );
};
```

### What is React Native?

React Native lets you write JavaScript code that runs on both iOS and Android. Instead of writing separate code for each platform, you write once and it works everywhere.

**Key React Native Components we use:**
- `<View>` - Like a `<div>` in web, a container
- `<Text>` - For displaying text
- `<Image>` - For showing images
- `<TouchableOpacity>` - A button that responds to touches
- `<ScrollView>` - Scrollable content area

### What is Expo?

Expo is a framework that makes React Native development easier:

- **No need for Xcode/Android Studio** (for basic development)
- **Easy camera access** - Just install `expo-camera`
- **Fast development** - See changes instantly
- **Built-in tools** - Icons, fonts, and more

**How Expo works in this project:**
- `app.json` - Configuration file (app name, icons, etc.)
- `expo start` - Starts the development server
- Expo Go app - Test your app on a real device without building

---

## 📁 Project Structure

```
calscan/
├── src/
│   ├── App.jsx              # Main app component (all the logic)
│   ├── assets/
│   │   ├── images/          # Images used in the app
│   │   └── fonts/           # Custom fonts (if any)
│   └── scripts/             # Utility scripts
├── app.json                 # Expo configuration
├── package.json             # Dependencies and scripts
├── babel.config.js          # Babel configuration (for transpiling)
├── tailwind.config.js       # Tailwind CSS configuration
├── global.css               # Global styles
├── index.js                 # App entry point
└── .env                     # Environment variables (create this)
```

### Key Files Explained

**`index.js`** - The entry point of the app:
```jsx
import App from "./src/App";
registerRootComponent(App);  // This tells Expo to start with our App component
```

**`App.jsx`** - Contains all the app logic (439 lines). This is where everything happens!

**`app.json`** - Expo configuration:
- App name: "calscan"
- Icon paths
- Platform settings (iOS, Android, Web)

**`babel.config.js`** - Transforms modern JavaScript:
- `babel-preset-expo` - Expo's preset
- `nativewind/babel` - Enables Tailwind CSS classes
- `inline-dotenv` - Loads `.env` file variables

---

## 🤖 How AI Powers This App

### Google Gemini AI Integration

We use **Google's Gemini 3 Flash** model to analyze food images. Here's how it works:

#### 1. **Setting Up the AI Client**

```jsx
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
```

**What this does:**
- Creates a connection to Google's AI service
- Uses your API key from the `.env` file for authentication

#### 2. **The Analysis Function**

```jsx
const analyzeImage = async (imageData) => {
  setLoading(true);  // Show loading spinner
  try {
    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: "models/gemini-3-flash-preview",
    });
    
    // Create a prompt (instructions for the AI)
    const prompt = 'Identify food and count nutritional values...';
    
    // Send image + prompt to AI
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageData.base64, mimeType: "image/jpeg" } },
    ]);
    
    // Parse the AI's response
    const data = JSON.parse(result.response.text());
    
    // Save the results
    setNutrition(data);
    setHistory((prev) => [{ ...data, uri: imageData.uri }, ...prev]);
  } catch (err) {
    Alert.alert("Error", "Analysis failed.");
  } finally {
    setLoading(false);  // Hide loading spinner
  }
};
```

**Step-by-step breakdown:**

1. **`setLoading(true)`** - Shows a loading indicator to the user
2. **`getGenerativeModel()`** - Selects which AI model to use (Gemini 3 Flash)
3. **Prompt** - Instructions telling the AI what to do:
   - "Identify food and count nutritional values"
   - "Return JSON with food name, calories, sugar, protein"
4. **`generateContent()`** - Sends the image (as base64) and prompt to Gemini
5. **Response parsing** - The AI returns text, we parse it as JSON
6. **State update** - Save results to `nutrition` state and add to `history`

#### 3. **Why This Approach is Powerful**

- **No manual food database** - AI recognizes thousands of foods
- **Handles portion sizes** - AI estimates based on visual appearance
- **Flexible** - Works with any food, even mixed meals
- **Fast** - Analysis happens in seconds

#### 4. **The Prompt Engineering**

Our prompt is carefully crafted:
```javascript
'Identify food and count nutritional values. if possible be precise with the values and quantity. Return strictly JSON: { "food": "Name", "calories": 564, "sugar": "2.8g", "protein": "33.3g" }. (if image is not food reurn the identified object nae with other valures nulled feeel free to be funny in that case just be very short)'
```

**Key elements:**
- Clear instructions
- Specific output format (JSON)
- Error handling (non-food items)
- Personality (funny responses for non-food)

---

## 🧩 Components Explained

### Main App Component Structure

The `App.jsx` file uses **conditional rendering** to show different screens:

```jsx
export default function App() {
  // State variables (data that can change)
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Three different views based on state:
  
  // 1. Dashboard (default view)
  if (!showCamera && !photo) {
    return <DashboardView />;
  }
  
  // 2. Camera view
  if (showCamera) {
    return <CameraView />;
  }
  
  // 3. Results view
  return <ResultsView />;
}
```

### Component Nesting Logic

#### 1. **Dashboard View** (Lines 74-230)

**Structure:**
```
SafeAreaView (ensures content isn't hidden by notches)
├── Header (app title and logo)
├── ScrollView (scrollable content)
    ├── Hero Section (welcome image and text)
    ├── Camera Button (main action)
    └── History List (previous scans)
```

**Key Code:**
```jsx
<SafeAreaView className="flex-1 bg-blue-50">
  {/* Header */}
  <View className="px-6 pt-6 pb-6 bg-white/80">
    <Text className="text-4xl font-extrabold">NutriScan</Text>
  </View>
  
  <ScrollView>
    {/* Hero */}
    <View>
      <Image source={require("./assets/images/hero.png")} />
      <Text>Instant Nutrition Analysis</Text>
    </View>
    
    {/* Camera Button */}
    <TouchableOpacity onPress={() => setShowCamera(true)}>
      <Ionicons name="camera" size={70} />
    </TouchableOpacity>
    
    {/* History */}
    {history.map((item, index) => (
      <HistoryItem key={index} item={item} />
    ))}
  </ScrollView>
</SafeAreaView>
```

**How it works:**
- `SafeAreaView` - Prevents content from going under the notch/status bar
- `ScrollView` - Makes content scrollable if it's too long
- `history.map()` - Loops through each scanned item and displays it
- `onPress={() => setShowCamera(true)}` - When button is pressed, show camera

#### 2. **Camera View** (Lines 234-278)

**Structure:**
```
View (full screen, black background)
├── CameraView (the actual camera)
├── Top Bar (close button)
├── Guide Frame (visual guide for positioning food)
└── Capture Button (take photo)
```

**Key Code:**
```jsx
<View className="flex-1 bg-black">
  {/* Camera fills entire screen */}
  <CameraView 
    style={StyleSheet.absoluteFill} 
    ref={cameraRef} 
  />
  
  {/* Overlay elements */}
  <SafeAreaView>
    <TouchableOpacity onPress={() => setShowCamera(false)}>
      <Ionicons name="close" />
    </TouchableOpacity>
  </SafeAreaView>
  
  {/* Guide frame */}
  <View>
    <View className="w-[280px] h-[280px] border-4 border-white" />
    <Text>Position your meal in the frame</Text>
  </View>
  
  {/* Capture button */}
  <TouchableOpacity onPress={takePicture}>
    <View className="w-20 h-20 rounded-full bg-white" />
  </TouchableOpacity>
</View>
```

**How it works:**
- `CameraView` - The actual camera component from Expo
- `ref={cameraRef}` - Reference to control the camera (take pictures)
- `StyleSheet.absoluteFill` - Makes camera fill entire screen
- `takePicture()` - Function that captures the photo

#### 3. **Results View** (Lines 281-392)

**Structure:**
```
View
├── Header (image display)
├── ScrollView
    ├── Food Name & Description
    ├── Stats Grid (calories, protein, sugar)
    └── Action Buttons
```

**Key Code:**
```jsx
<View className="flex-1 bg-gray-50">
  {/* Header with circular image */}
  <View>
    <Image 
      source={{ uri: photo }} 
      className="w-[240px] h-[240px] rounded-[120px]"
    />
  </View>
  
  <ScrollView>
    {/* Food name */}
    <Text className="text-3xl font-extrabold">
      {nutrition?.food || "Unknown Food"}
    </Text>
    
    {/* Stats */}
    {!loading && nutrition && (
      <View className="flex-row justify-between">
        <StatBox label="Calories" value={nutrition.calories} />
        <StatBox label="Protein" value={nutrition.protein} />
        <StatBox label="Sugars" value={nutrition.sugar} />
      </View>
    )}
    
    {/* Buttons */}
    <TouchableOpacity onPress={() => setPhoto(null)}>
      <Text>Scan Complete</Text>
    </TouchableOpacity>
  </ScrollView>
</View>
```

**How it works:**
- `{nutrition?.food}` - Optional chaining: only show if nutrition exists
- `{!loading && nutrition && (...)}` - Only show stats if not loading AND nutrition exists
- `StatBox` - Reusable component for displaying stats

### StatBox Component (Lines 395-438)

A **reusable component** that displays a single nutrition stat:

```jsx
const StatBox = ({ label, value, iconName, color = "blue" }) => {
  // Color mapping
  const colorClasses = {
    orange: "bg-orange-50 border-orange-200",
    blue: "bg-blue-50 border-blue-200",
    pink: "bg-pink-50 border-pink-200",
  };
  
  return (
    <View className={`w-[30%] p-4 rounded-2xl ${colorClasses[color]}`}>
      <Ionicons name={iconName} size={28} />
      <Text className="text-xs">{label}</Text>
      <Text className="text-lg font-extrabold">{value || "--"}</Text>
    </View>
  );
};
```

**Usage:**
```jsx
<StatBox 
  label="Calories" 
  value={nutrition?.calories} 
  iconName="flame" 
  color="orange" 
/>
```

**What makes it reusable:**
- Accepts `props` (label, value, iconName, color)
- Can be used multiple times with different data
- Has default values (`color = "blue"`)

---

## 🎨 Styling with NativeWind

### What is NativeWind?

NativeWind brings **Tailwind CSS** to React Native. Instead of writing traditional CSS, you use utility classes directly in your JSX.

### How It Works

1. **Installation** - Already configured in `babel.config.js` and `tailwind.config.js`
2. **Global CSS** - `global.css` imports Tailwind directives
3. **Usage** - Use `className` prop instead of `style` prop

### Styling Examples from Our Code

#### Spacing & Layout
```jsx
// Padding
className="px-6 pt-6 pb-6"  // px = horizontal, pt = top, pb = bottom

// Margin
className="mb-8 mt-6"  // mb = margin bottom, mt = margin top

// Width & Height
className="w-[140px] h-[140px]"  // Custom sizes in brackets
className="w-full"  // 100% width
className="flex-1"  // Takes remaining space
```

#### Colors
```jsx
className="bg-blue-50"  // Light blue background
className="text-blue-700"  // Dark blue text
className="border-blue-200"  // Blue border
```

#### Flexbox (Layout)
```jsx
className="flex-row"  // Horizontal layout
className="items-center"  // Center items vertically
className="justify-between"  // Space items apart
className="flex-1"  // Take available space
```

#### Borders & Shadows
```jsx
className="rounded-2xl"  // Rounded corners
className="border-4 border-white"  // 4px white border
className="shadow-xl"  // Large shadow
```

#### Combining Classes
```jsx
className="bg-white rounded-2xl px-8 py-4 shadow-lg border border-blue-100"
// Multiple utilities combined:
// - White background
// - Rounded corners
// - Padding
// - Shadow
// - Border
```

### Why This Approach?

**Advantages:**
- **Fast development** - No switching between files
- **Consistent design** - Predefined spacing/colors
- **Responsive** - Easy to make responsive layouts
- **Readable** - See styles directly in component

**Traditional way (without NativeWind):**
```jsx
<View style={{
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
}}>
```

**NativeWind way:**
```jsx
<View className="bg-white rounded-2xl p-4 shadow-lg">
```

Much cleaner! 🎉

---

## ✨ Key Features

### 1. **AI-Powered Food Recognition**
- Take a photo of any food
- AI identifies the food and estimates nutritional values
- Works with mixed meals and various portion sizes

### 2. **Real-Time Camera Interface**
- Full-screen camera view
- Visual guide frame for positioning
- High-quality image capture

### 3. **Nutritional Information Display**
- Calories
- Protein content
- Sugar content
- Beautiful, color-coded stat cards

### 4. **Scan History**
- Automatically saves all scanned meals
- Quick access to previous scans
- Shows thumbnail, food name, and key stats

### 5. **Beautiful UI**
- Modern, clean design
- Smooth transitions between screens
- Intuitive navigation
- Loading states and error handling

### Screenshots Section

*Note: To add screenshots, place image files in a `screenshots/` folder and reference them like:*

```markdown
### Dashboard Screen
![Dashboard](./screenshots/dashboard.png)

### Camera Screen
![Camera](./screenshots/camera.png)

### Results Screen
![Results](./screenshots/results.png)
```

---

## 🔍 Code Walkthrough

### State Management

**What is State?**
State is data that can change and causes the UI to update when it changes.

**Our State Variables:**
```jsx
const [permission, requestPermission] = useCameraPermissions();
// Camera permission status

const [photo, setPhoto] = useState(null);
// The captured photo URI (null = no photo)

const [loading, setLoading] = useState(false);
// Whether AI analysis is in progress

const [nutrition, setNutrition] = useState(null);
// The nutrition data from AI (null = no data yet)

const [showCamera, setShowCamera] = useState(false);
// Whether to show camera view (false = show dashboard)

const [history, setHistory] = useState([]);
// Array of all previous scans
```

**How State Works:**
```jsx
// Initial value
const [count, setCount] = useState(0);

// Update state
setCount(5);  // count is now 5
setCount(count + 1);  // count increases by 1

// React automatically re-renders when state changes!
```

### The Camera Flow

1. **User taps "Scan Your Meal" button**
   ```jsx
   onPress={() => setShowCamera(true)}
   ```
   - Sets `showCamera` to `true`
   - App re-renders and shows camera view

2. **User takes photo**
   ```jsx
   const takePicture = async () => {
     const data = await cameraRef.current.takePictureAsync({
       quality: 0.8,
       base64: true,  // Important: needed for AI analysis
     });
     setPhoto(data.uri);  // Save photo URI
     setShowCamera(false);  // Hide camera
     analyzeImage(data);  // Send to AI
   };
   ```

3. **AI analyzes image**
   - Photo is converted to base64 (text format)
   - Sent to Gemini AI with a prompt
   - AI returns JSON with nutrition data

4. **Display results**
   - `nutrition` state is updated
   - App re-renders showing results view
   - Photo and nutrition data are displayed

### History Management

**Adding to History:**
```jsx
setHistory((prev) => [{ ...data, uri: imageData.uri }, ...prev]);
```

**Breaking this down:**
- `prev` - Previous history array
- `{ ...data, uri: imageData.uri }` - New item (spread nutrition data, add photo URI)
- `[...prev]` - Spread previous items
- Result: New item at front, old items after

**Example:**
```javascript
// Before: history = [{food: "Apple", calories: 95}, {food: "Banana", calories: 105}]
// After adding "Orange":
// history = [{food: "Orange", calories: 62}, {food: "Apple", calories: 95}, {food: "Banana", calories: 105}]
```

**Displaying History:**
```jsx
{history.map((item, index) => (
  <View key={index}>
    <Image source={{ uri: item.uri }} />
    <Text>{item.food}</Text>
    <Text>{item.calories} kcal</Text>
  </View>
))}
```

- `map()` - Loops through each item
- `key={index}` - React needs unique keys for list items
- Creates a View for each history item

### Conditional Rendering

**Three Views Based on State:**
```jsx
// View 1: Dashboard (default)
if (!showCamera && !photo) {
  return <DashboardView />;
}

// View 2: Camera
if (showCamera) {
  return <CameraView />;
}

// View 3: Results
return <ResultsView />;
```

**Logic:**
- If camera is NOT shown AND no photo exists → Dashboard
- If camera IS shown → Camera view
- Otherwise → Results view

**Why this works:**
- Only one condition can be true at a time
- State changes trigger re-renders
- React shows the appropriate view

---

## 🔧 Utilities & Helper Functions

### 1. **Image Analysis Function**

```jsx
const analyzeImage = async (imageData) => {
  setLoading(true);
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-3-flash-preview",
    });
    const prompt = 'Identify food and count nutritional values...';
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageData.base64, mimeType: "image/jpeg" } },
    ]);
    const data = JSON.parse(
      result.response.text().replace(/```json|```/g, "").trim()
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
```

**What it does:**
- Shows loading indicator
- Sends image to AI
- Parses response (removes markdown code blocks)
- Updates state
- Handles errors gracefully

### 2. **Photo Capture Function**

```jsx
const takePicture = async () => {
  if (cameraRef.current) {
    const data = await cameraRef.current.takePictureAsync({
      quality: 0.8,  // 80% quality (balance between size and quality)
      base64: true,  // Include base64 for AI
    });
    setPhoto(data.uri);  // Save photo path
    setShowCamera(false);  // Hide camera
    analyzeImage(data);  // Analyze immediately
  }
};
```

**Key points:**
- Checks if camera ref exists
- `async/await` - Handles asynchronous operations
- `base64: true` - Required for AI analysis
- Automatically triggers analysis

### 3. **Response Parsing**

```jsx
const data = JSON.parse(
  result.response.text().replace(/```json|```/g, "").trim()
);
```

**Why this is needed:**
- AI sometimes returns JSON wrapped in markdown code blocks: ` ```json {...} ``` `
- We remove the markdown syntax
- Parse the clean JSON string into an object

---

## 🔐 Environment Variables

### Setting Up `.env` File

Create a `.env` file in the root directory:

```env
GOOGLE_AI_API_KEY=your_actual_api_key_here
```

### Getting Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in your `.env` file

### How It's Used

```jsx
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
```

**Why `.env`?**
- Keeps API keys secret (don't commit to Git!)
- Easy to change without editing code
- `babel-plugin-inline-dotenv` loads it automatically

### Security Note

**Never commit `.env` to Git!** Add it to `.gitignore`:
```
.env
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **"API Key not found" Error**
- Make sure `.env` file exists in root directory
- Check that key is named `GOOGLE_AI_API_KEY`
- Restart the development server after creating `.env`

#### 2. **Camera Not Working**
- Check device permissions (should prompt automatically)
- On iOS Simulator: Camera won't work (use physical device)
- On Android Emulator: Enable camera in emulator settings

#### 3. **App Crashes on Photo Capture**
- Check that `base64: true` is set in `takePictureAsync`
- Ensure API key is valid
- Check internet connection (needed for AI analysis)

#### 4. **Styling Not Working**
- Make sure NativeWind is configured in `babel.config.js`
- Check that `global.css` is imported in `index.js`
- Restart Metro bundler: `npm start -- --reset-cache`

#### 5. **Images Not Displaying**
- Check image paths are correct
- For local images: Use `require("./path/to/image.png")`
- For network images: Use `{ uri: "https://..." }`
- Check that images exist in `src/assets/images/`

### Debugging Tips

**Console Logging:**
```jsx
console.log("Current state:", { photo, nutrition, loading });
```

**React Native Debugger:**
- Shake device (or Cmd+D on simulator)
- Select "Debug" to open Chrome DevTools

**Check Network Requests:**
- Open Chrome DevTools → Network tab
- See API calls to Google AI

---

## 📝 Additional Notes

### Why This Project is Great for Learning

1. **Real-world application** - Solves an actual problem
2. **Modern stack** - Uses current best practices
3. **AI integration** - Shows how to use LLMs in apps
4. **Complete flow** - Camera → Processing → Display
5. **State management** - Multiple states working together
6. **UI/UX** - Beautiful, user-friendly interface

### Next Steps to Enhance

- Add more nutrition metrics (carbs, fat, fiber)
- Save history to device storage (AsyncStorage)
- Add meal tracking (breakfast, lunch, dinner)
- Export data to CSV/PDF
- Add user profiles
- Dark mode support
- Food database for accuracy comparison

### Learning Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Google AI Docs](https://ai.google.dev/docs)
- [React Hooks Guide](https://react.dev/reference/react)

---

## 📄 License

This project is private and for personal use.

---

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Icons from [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- Styled with [Tailwind CSS](https://tailwindcss.com/) via [NativeWind](https://www.nativewind.dev/)

---

**Happy Coding! 🚀**

If you have questions, refer to the code comments or the official documentation links above.
