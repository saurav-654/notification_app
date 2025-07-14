# 📱 Notification Hub - React Native FCM App

A beautiful and modern React Native application for handling Firebase Cloud Messaging (FCM) notifications with real-time updates and elegant UI design.

## ✨ Features

- 🔔 **Real-time FCM Notifications** - Receive push notifications via Firebase Cloud Messaging
- 🎨 **Beautiful UI Design** - Modern, attractive interface with smooth animations
- 📱 **Cross-platform** - Works on both Android and iOS
- 🚀 **Deep Linking** - Navigate to specific screens when notifications are tapped
- 📊 **Notification Management** - View, mark as read, and remove notifications
- 💾 **Local Storage** - Persistent notification history
- 🎯 **Badge Counts** - WhatsApp-like unread notification counters
- 🔧 **Backend Simulation** - Test notifications with built-in simulation

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile development
- **Firebase Cloud Messaging** - Push notifications
- **TypeScript** - Type-safe development
- **React Hooks** - Modern React patterns
- **Native Modules** - Custom FCM integration

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Firebase project with FCM enabled

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saurav-654/notification_app.git
   cd notification_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add your Android/iOS app to the project
   - Download `google-services.json` (Android) and place it in `android/app/`
   - Download `GoogleService-Info.plist` (iOS) and add it to your iOS project

4. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

## 🏃‍♂️ Running the App

### Development Mode

1. **Start Metro bundler**
   ```bash
   npm start
   # or
   yarn start
   ```

2. **Run on Android**
   ```bash
   npm run android
   # or
   yarn android
   ```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Screenshot

<img width="334" height="732" alt="Screenshot 2025-07-13 232017" src="https://github.com/user-attachments/assets/b62bfbfe-5acd-4317-ba59-3c14aac7934f" />
<img width="332" height="730" alt="Screenshot 2025-07-14 002748" src="https://github.com/user-attachments/assets/83d115da-a1de-4496-90a7-e9415b0b0e90" />
<img width="325" height="725" alt="Screenshot 2025-07-14 002617" src="https://github.com/user-attachments/assets/2d04eb3e-e0f1-4184-b364-b8fcd8540b3a" />

