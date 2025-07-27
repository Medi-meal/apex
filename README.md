# 🍽️ Medimeal - AI-Powered Personalized Meal Recommendations

A comprehensive web application that provides personalized meal recommendations based on your health profile, medications, and dietary preferences. Built with React, Node.js, and powered by Google's Gemini AI.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Meal Recommendations**: Get personalized breakfast, lunch, and dinner suggestions
- **Health Profile Management**: Store and manage your health information, medications, and dietary restrictions
- **Food Safety Check**: Verify if specific foods are safe for your condition
- **Email Notifications**: Receive daily meal recommendations via email
- **User Authentication**: Secure signup and login with Google OAuth support

### 🏥 Health-Focused Features
- **Medication Integration**: Recommendations consider your current medications
- **Disease-Specific Guidance**: Tailored advice based on your health conditions
- **BMI Calculation**: Automatic BMI calculation and health categorization
- **Dietary Restrictions**: Support for religious, cultural, and personal food preferences
- **Allergy Awareness**: Avoid foods that may cause allergic reactions

### 📊 User Experience
- **Interactive Dashboard**: Beautiful, responsive UI with modern design
- **Meal Tracking**: Mark foods as eaten or avoided
- **Favorites System**: Save your preferred meal recommendations
- **Progress Tracking**: Monitor your dietary journey with streaks and statistics
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Google OAuth** - Authentication integration

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality

### AI & External Services
- **Google Gemini AI** - Meal recommendations and food safety checks
- **Google OAuth 2.0** - User authentication

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Cloud Platform account (for Gemini AI and OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apex
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   **Server Environment** (`server/.env`):
   ```env
   MONGO_URI=mongodb://localhost:27017/medimeal
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
  
   PORT=5000
   ```

  

4. **Start the application**
   ```bash
   # Start the backend server (from server directory)
   node index.js

   # Start the frontend (from client directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth authentication

### User Management
- `GET /api/user-profile` - Get user profile
- `POST /api/user-profile` - Update user profile
- `GET /api/user-stats` - Get user statistics

### Meal Recommendations
- `POST /api/gemini-recommend` - Generate meal recommendations
- `POST /api/gemini-food-check` - Check food safety
- `POST /api/send-meal-email` - Send email notifications

### Data Management
- `POST /api/user-input` - Save user input and recommendations
- `GET /api/user-input` - Get user input history
- `GET /api/user-input/history` - Get complete input history

## 🏗️ Project Structure

```
apex/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # CSS files
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # App entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB schemas
│   ├── index.js          # Main server file
│   └── package.json      # Backend dependencies
└── README.md             # This file
```

## 🔧 Configuration

### Google Gemini AI Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your server `.env` file

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Add client ID to both server and client `.env` files

### Email Configuration
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Add email credentials to server `.env` file

## 🎨 Key Features Explained

### AI Meal Recommendations
The application uses Google's Gemini AI to generate personalized meal recommendations based on:
- User's age, gender, and BMI
- Current medications and health conditions
- Dietary preferences and restrictions
- Food allergies and intolerances

### Food Safety Check
Users can check if specific foods are safe for their condition by:
- Entering the food name
- Getting instant AI-powered safety assessment
- Receiving warnings for potential food-drug interactions

### Email Notifications
- Beautiful HTML email templates
- Daily meal recommendations
- Personalized with user's name
- Includes both recommended and not-recommended foods

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure session management
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side data validation
- **Environment Variables**: Sensitive data protection

## 📱 User Interface

The application features a modern, responsive design with:
- **Gradient backgrounds** and smooth animations
- **Interactive elements** with hover effects
- **Mobile-first** responsive design
- **Accessibility features** for better user experience
- **Intuitive navigation** with clear visual hierarchy

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend Deployment (Heroku/Railway)
1. Set up MongoDB Atlas for database
2. Configure environment variables
3. Deploy the server directory
4. Update frontend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Push notifications
- [ ] Meal planning calendar
- [ ] Recipe suggestions
- [ ] Nutritional information
- [ ] Social features
- [ ] Mobile app version
- [ ] Integration with fitness trackers
- [ ] Voice commands
- [ ] Barcode scanning for food items

---

**Made with ❤️ for better health and nutrition**
