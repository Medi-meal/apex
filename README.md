# Medimeal - AI-Powered Personalized Nutrition Platform

🍽️ **Smart meal recommendations tailored to your health, medications, and dietary preferences**

## 🌟 Features

### ✅ Current Features
- **AI-Powered Meal Recommendations** - Personalized meal plans based on health conditions and medications
- **Medication Safety Checks** - Drug-food interaction warnings and safe food suggestions
- **Multi-step Profile Wizard** - Comprehensive health profile creation
- **User Authentication** - Secure login with Google OAuth integration
- **Recommendation History** - Track and review past meal plans
- **Interactive Dashboard** - Overview of health metrics and quick actions
- **Real-time Food Analysis** - Check individual foods for safety and interactions

### 🚀 New Enhanced Features
- **📊 Dashboard Analytics** - Visual stats showing health streaks, meals tracked, and recommendations
- **🍽️ Meal Tracker** - Daily meal logging with completion tracking
- **🔍 Food Safety Analyzer** - Real-time analysis of individual foods for safety
- **📈 Enhanced History View** - Better visualization of recommendation timeline
- **🎯 Quick Actions** - Fast access to key features from dashboard
- **📱 Responsive Design** - Mobile-first design with modern UI components
- **⚡ Loading States** - Smooth loading animations and error handling
- **🔔 Notification System** - User-friendly alerts and confirmations

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **React Router Dom** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast development server and build tool
- **CSS3** - Custom styling with modern CSS features

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database for user data and recommendations
- **Mongoose** - MongoDB object modeling
- **Google Gemini AI** - AI-powered meal recommendations
- **Google OAuth** - Authentication system
- **bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Google OAuth credentials
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medimeal.git
   cd medimeal
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   ```

5. **Start the development servers**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   node index.js
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
medimeal/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── MealTracker.jsx
│   │   │   ├── FoodAnalyzer.jsx
│   │   │   ├── EnhancedFeatures.jsx
│   │   │   ├── UIComponents.jsx
│   │   │   ├── NotificationSystem.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── GeminiRecommend.jsx
│   │   │   ├── ProfileWizard.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── assets/        # Images and static files
│   │   └── App.jsx        # Main App component
│   └── package.json
└── server/                # Node.js backend
    ├── models/           # Database models
    │   ├── User.js
    │   └── UserInput.js
    ├── index.js          # Main server file
    └── package.json
```

## 🎯 Key Components

### Dashboard Components
- **DashboardStats** - Visual metrics and statistics
- **MealTracker** - Daily meal logging interface
- **FoodAnalyzer** - Individual food safety analysis

### UI Components
- **LoadingSpinner** - Animated loading states
- **ErrorMessage** - User-friendly error displays
- **SkeletonCard** - Loading placeholders
- **EmptyState** - Empty data state handling

### Utility Components
- **NotificationSystem** - Toast notifications
- **EnhancedFeatures** - Landing page feature showcase

## 🔄 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login

### Meal Recommendations
- `POST /api/gemini-recommend` - Get AI meal recommendations
- `POST /api/food-analysis` - Analyze individual food safety

### User Data
- `GET /api/user-input/history` - Get user recommendation history
- `POST /api/user-input` - Save user health profile

## 🎨 Styling Guidelines

- **Colors**: Green primary (#22c55e), with blue, orange, and red accents
- **Typography**: System fonts with clear hierarchy
- **Spacing**: Consistent rem-based spacing
- **Components**: Card-based layouts with rounded corners
- **Interactions**: Smooth hover effects and transitions

## 🔐 Security Features

- Password hashing with bcrypt
- Google OAuth integration
- Input validation and sanitization
- Error boundaries for graceful error handling
- Secure API endpoints

## 📊 Health Data Handling

- Comprehensive health profile collection
- Medication interaction database
- BMI calculation and health metrics
- Dietary preference management
- Recommendation history tracking

## 🚀 Future Enhancements

### Planned Features
- **Wearable Integration** - Sync with fitness trackers
- **Social Features** - Share meal plans with family/friends
- **Healthcare Provider Portal** - Professional dashboard
- **Voice Commands** - Voice-activated meal logging
- **Photo Recognition** - Scan food photos for analysis
- **Grocery Integration** - Generate shopping lists
- **Meal Prep Planning** - Weekly meal prep suggestions

### Technical Improvements
- **Real-time Updates** - WebSocket integration
- **Offline Support** - Progressive Web App features
- **Performance Optimization** - Code splitting and lazy loading
- **Testing Suite** - Unit and integration tests
- **CI/CD Pipeline** - Automated deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent meal recommendations
- Unsplash for beautiful food photography
- React community for excellent documentation
- MongoDB for reliable data storage

---

**Made with ❤️ for better health through technology**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
