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
   git clone <repository-url>
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

3. **Run on iOS** (macOS only)
   ```bash
   npm run ios
   # or
   yarn ios
   ```

### Installing on Your Phone

#### Method 1: Development Build
```bash
# Connect your phone via USB with USB debugging enabled
npx react-native run-android
```

#### Method 2: Generate APK
```bash
cd android
./gradlew assembleRelease
# APK will be generated at: android/app/build/outputs/apk/release/app-release.apk
```

## 📱 App Screenshots

The app features:
- **Beautiful Header** with gradient design
- **Welcome Screen** with notification center introduction
- **Message Display** with attractive card layout
- **Footer** with creator attribution

## 🔧 Configuration

### Firebase Configuration

1. **Android**: Place `google-services.json` in `android/app/`
2. **iOS**: Add `GoogleService-Info.plist` to your Xcode project

### Notification Payload Format

Send notifications with this structure for deep linking:

```json
{
  "notification": {
    "title": "Notification Title",
    "body": "Notification message body"
  },
  "data": {
    "screen": "notifications",
    "userId": "123",
    "type": "message"
  }
}
```

## 🎯 Usage

### Receiving Notifications

The app handles notifications in three states:
- **Foreground**: Shows alert and updates UI
- **Background**: Opens app and navigates to specified screen
- **Quit**: Launches app and navigates to specified screen

### Deep Linking

Include a `screen` parameter in notification data to navigate to specific screens:
- `notifications` - Notifications list screen
- `profile` - User profile screen
- `messages` - Messages screen
- `orders` - Orders screen

### Notification Management

- View all received notifications
- Mark notifications as read/unread
- Remove individual notifications
- Clear all notifications
- Badge count for unread notifications

## 🏗️ Project Structure

```
notification_app/
├── App.tsx                 # Main app component
├── services/
│   └── NotificationService.js  # FCM service utilities
├── android/                # Android-specific files
├── ios/                    # iOS-specific files
└── README.md              # This file
```

## 🔍 Troubleshooting

### Common Issues

1. **FCM not working**
   - Verify Firebase configuration files are in correct locations
   - Check if notification permissions are granted
   - Ensure FCM token is being generated

2. **Build errors**
   - Clean and rebuild: `npx react-native clean && npm run android`
   - Clear Metro cache: `npx react-native start --reset-cache`

3. **Notification not showing**
   - Check device notification settings
   - Verify FCM token in console logs
   - Test with Firebase Console test message

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Created by Saurav Agrawal**

- Elegant UI design with modern React Native patterns
- Firebase Cloud Messaging integration
- Cross-platform compatibility
- Real-time notification handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review [React Native documentation](https://reactnative.dev/docs/getting-started)
3. Check [Firebase documentation](https://firebase.google.com/docs/cloud-messaging)
4. Open an issue in the repository

---

### 🎉 Thank you for using Notification Hub!

This app demonstrates modern React Native development with Firebase integration, beautiful UI design, and comprehensive notification handling. Perfect for learning FCM implementation or as a starting point for your own notification-based applications.
