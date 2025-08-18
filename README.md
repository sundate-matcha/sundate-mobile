# SunDate Mobile

A modern React Native mobile application for real-time notifications and dating app functionality, built with Expo and modern UI components.

## 🚀 Features

- **Real-time Notifications**: Socket.io integration for instant notification delivery
- **Modern UI/UX**: Beautiful, responsive design using React Native Paper
- **Tab Navigation**: Bottom tab navigation with stack navigation for detailed views
- **Push Notifications**: Expo notifications with custom handling
- **Mock Data**: Built-in mock data for testing and development
- **TypeScript**: Full TypeScript support for better development experience
- **Responsive Design**: Optimized for both iOS and Android

## 📱 Screens

### Home Screen
- Welcome message and quick actions
- Recent notifications preview
- Connection status indicator
- Test notification functionality

### Notifications Screen
- Complete notification list with search and filtering
- Mark as read functionality
- Filter by notification type (info, success, warning, error)
- Bulk actions (mark all as read, clear all)

### Profile Screen
- User profile information
- Editable profile fields
- Notification preferences
- App settings and legal information

### Notification Detail Screen
- Detailed notification view
- Action buttons and sharing
- Additional metadata display
- Navigation to related screens

## 🛠 Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **React Native Paper**: Material Design components
- **Socket.io**: Real-time communication
- **Expo Notifications**: Push notification handling

## 📦 Dependencies

### Core
- `expo`: ~50.0.0
- `react`: 18.2.0
- `react-native`: 0.73.6

### Navigation
- `@react-navigation/native`: ^6.1.9
- `@react-navigation/bottom-tabs`: ^6.5.11
- `@react-navigation/stack`: ^6.3.20

### UI Components
- `react-native-paper`: ^5.12.1
- `react-native-vector-icons`: ^10.0.3
- `@expo/vector-icons`: ^14.0.0

### Real-time & Notifications
- `socket.io-client`: ^4.7.4
- `expo-notifications`: ~0.27.6
- `expo-device`: ~5.9.3

### Utilities
- `react-native-safe-area-context`: 4.8.2
- `react-native-screens`: ~3.29.0
- `react-native-gesture-handler`: ~2.14.0
- `react-native-reanimated`: ~3.6.2

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sundate-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## 🔧 Configuration

### Environment Setup
The app is configured to work with mock data by default. To connect to a real backend:

1. Update `src/services/SocketService.ts` with your server URL
2. Set `useMock: false` in the SocketService
3. Update API endpoints in `src/utils/constants.ts`

### Notification Configuration
- Update notification settings in `app.json`
- Configure push notification certificates
- Customize notification sounds and icons

## 📁 Project Structure

```
sundate-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── navigation/          # Navigation configuration
│   ├── screens/            # Screen components
│   ├── services/           # Business logic and API services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions and constants
├── assets/                 # Static assets (images, sounds)
├── App.tsx                 # Main app component
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔌 Services

### NotificationService
- Push notification registration
- Local notification scheduling
- Mock data management
- Notification status updates

### SocketService
- Real-time communication
- Automatic reconnection
- Mock socket for development
- Event handling

## 🎨 UI Components

The app uses React Native Paper for consistent Material Design:

- **Cards**: Information display and grouping
- **Buttons**: Various button styles and states
- **Chips**: Compact information display
- **Avatars**: User profile images
- **FABs**: Floating action buttons
- **Search**: Search functionality
- **Lists**: Organized information display

## 📱 Platform Support

- **iOS**: 13.0+
- **Android**: 6.0+ (API level 23+)
- **Web**: React Native Web support

## 🧪 Testing

### Mock Data
The app includes comprehensive mock data for testing:
- Sample notifications with different types
- User profile information
- Real-time notification simulation

### Development Features
- Hot reloading
- Error boundaries
- Console logging
- Debug information

## 🚀 Deployment

### Building for Production

1. **Configure EAS Build**
   ```bash
   eas build:configure
   ```

2. **Build for platforms**
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

3. **Submit to stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## 🔒 Security Considerations

- No authentication required (as per requirements)
- Push tokens are handled securely
- Socket connections use secure protocols
- Input validation on user inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Expo documentation
- Review React Native documentation

## 🔮 Future Enhancements

- User authentication system
- Real backend API integration
- Advanced notification preferences
- Push notification analytics
- Offline support
- Performance optimizations
- Unit and integration tests
- CI/CD pipeline

## 📊 Performance

- Optimized re-renders with React hooks
- Efficient list rendering with FlatList
- Lazy loading for images
- Minimal bundle size
- Fast navigation transitions

---

**Built with ❤️ using React Native and Expo**