const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = '772559724147-utfpmphmr81s84n2eao0fnl7likdp79r.apps.googleusercontent.com';

const User = require('../server/models/User');
const UserInput = require('../server/models/UserInput');

// UserProfile schema for storing user dashboard data
const UserProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  profileData: {
    gender: String,
    age: Number,
    height: Number,
    weight: Number,
    eaterType: String,
    medications: [{
      name: String,
      dosage: String,
      duration: String
    }],
    diseaseDuration: String,
    allergies: String,
    foodRestrictions: String,
    bmi: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Signup Route - FIXED
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    // Return user data for frontend
    res.json({ 
      message: 'Signup successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route - FIXED
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Return user data for frontend
    res.json({ 
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Auth Route - FIXED
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'No credential provided' });
  
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({ 
      idToken: credential, 
      audience: GOOGLE_CLIENT_ID 
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    
    if (!email) return res.status(400).json({ message: 'No email in Google account' });
    
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name: name || '', email, password: '' });
      await user.save();
    }
    
    // Return user data for frontend
    res.json({ 
      message: 'Google login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.post('/api/gemini-recommend', async (req, res) => {
  const { age, medication, disease, gender, foodType, bmi } = req.body;

  const prompt = `
    Given the following user details:
    - Age: ${age}
    - Gender: ${gender}
    - BMI: ${bmi || 'not provided'}
    - Medication: ${medication}
    - Disease: ${disease}
    - Food preference: ${foodType}
    Suggest meal plans for Breakfast, Lunch, and Dinner.
    For each meal, provide:
      - "recommended": an array of objects with "food" and "quantity"
      - "not_recommended": an array of food names to avoid
    Respond ONLY with a valid JSON object with the following structure:
    {
      "breakfast": {
        "recommended": [{"food": "...", "quantity": "..."}],
        "not_recommended": ["...", "..."]
      },
      "lunch": { ... },
      "dinner": { ... }
    }
    Do not include any explanation or extra text.
  `;

  let attempts = 0;
  while (attempts < 3) {
    try {
      const geminiRes = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
        {
          contents: [{ parts: [{ text: prompt }] }]
        }
      );

      const text = geminiRes.data.candidates[0].content.parts[0].text;
      console.log('Gemini raw response:', text); // Debug log
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        result = match ? JSON.parse(match[0]) : {};
      }
      // Add fallback for missing meals
      ['breakfast', 'lunch', 'dinner'].forEach(meal => {
        if (!result[meal]) {
          result[meal] = { recommended: [], not_recommended: [] };
        }
      });
      return res.json(result);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error && err.response.data.error.message && err.response.data.error.message.toLowerCase().includes('overloaded')) {
        attempts++;
        await sleep(1500); // wait 1.5 seconds before retry
        continue;
      }
      const errorDetails = err.response?.data || err.message;
      console.error('Gemini API error:', errorDetails);
      return res.status(500).json({ message: 'Gemini API error', error: errorDetails });
    }
  }
  res.status(503).json({ message: 'Gemini model is overloaded. Please try again in a moment.' });
});

app.post('/api/gemini-flash-test', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = 'Explain how AI works in a few words';
  try {
    const flashRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        }
      }
    );
    res.json(flashRes.data);
  } catch (err) {
    const errorDetails = err.response?.data || err.message;
    console.error('Gemini Flash API error:', errorDetails);
    res.status(500).json({ message: 'Gemini Flash API error', error: errorDetails });
  }
});

app.post('/api/gemini-food-check', async (req, res) => {
  const { disease, medication, food } = req.body;
  if (!food) return res.status(400).json({ warning: 'No food provided.' });
  const prompt = `Given the user has ${disease || 'no specific disease'} and is taking ${medication || 'no medication'}, is ${food} safe to eat? Respond with a short warning if not safe, or say it is safe.`;
  try {
    const geminiRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    const text = geminiRes.data.candidates[0].content.parts[0].text;
    res.json({ warning: text.trim() });
  } catch (err) {
    const errorDetails = err.response?.data || err.message;
    console.error('Gemini food check error:', errorDetails);
    res.status(500).json({ warning: 'Could not check food safety.' });
  }
});

function recommendationsToText(recommendations) {
  if (!recommendations || typeof recommendations !== 'object') return '';
  const rec = recommendations.recommended && recommendations.recommended.length
    ? `Recommended: ${recommendations.recommended.join(', ')}`
    : '';
  const notRec = recommendations.not_recommended && recommendations.not_recommended.length
    ? `Not Recommended: ${recommendations.not_recommended.join(', ')}`
    : '';
  return [rec, notRec].filter(Boolean).join('\n');
}

// Save user input and recommendations
app.post('/api/user-input', async (req, res) => {
  console.log('POST /api/user-input called');
  console.log('Request body:', req.body);
  
  const { email, input, recommendations } = req.body;
  if (!email) {
    console.log('Error: No email provided');
    return res.status(400).json({ message: 'Email required' });
  }
  
  // Convert recommendations object to text summary
  const recommendationsText = recommendationsToText(recommendations);
  console.log('Converted recommendations text:', recommendationsText);
  
  try {
    const newInput = await UserInput.create({ 
      email, 
      input, 
      recommendations: recommendationsText 
    });
    console.log('UserInput created successfully:', newInput._id);
    res.json({ message: 'Saved', data: newInput });
  } catch (err) {
    console.error('Error saving user input:', err);
    res.status(500).json({ message: 'Error saving input', error: err.message });
  }
});

// Get all user input history (returns text summary)
app.get('/api/user-input/history', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email required' });
  try {
    const history = await UserInput.find({ email }).sort({ createdAt: -1 });
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching input history' });
  }
});

// Get user input
app.get('/api/user-input', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email required' });
  try {
    const found = await UserInput.findOne({ email });
    res.json({ input: found ? found.input : null });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching input' });
  }
});

// Save/Update user profile data
app.post('/api/user-profile', async (req, res) => {
  console.log('POST /api/user-profile called');
  console.log('Request body:', req.body);
  
  const { email, profileData } = req.body;
  if (!email) {
    console.log('Error: No email provided');
    return res.status(400).json({ message: 'Email required' });
  }
  
  try {
    const existingProfile = await UserProfile.findOne({ email });
    console.log('Existing profile found:', !!existingProfile);
    
    if (existingProfile) {
      // Update existing profile
      existingProfile.profileData = profileData;
      existingProfile.updatedAt = new Date();
      await existingProfile.save();
      console.log('Profile updated successfully');
      res.json({ message: 'Profile updated successfully', profile: existingProfile });
    } else {
      // Create new profile
      const newProfile = await UserProfile.create({
        email,
        profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('New profile created successfully');
      res.json({ message: 'Profile created successfully', profile: newProfile });
    }
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({ message: 'Error saving profile', error: err.message });
  }
});

// Get user profile data
app.get('/api/user-profile', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email required' });
  
  try {
    const profile = await UserProfile.findOne({ email });
    if (profile) {
      res.json({ profile: profile.profileData });
    } else {
      res.json({ profile: null });
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Get user dashboard stats
app.get('/api/user-stats', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email required' });
  
  try {
    const user = await User.findOne({ email });
    const history = await UserInput.find({ email }).sort({ createdAt: -1 });
    const profile = await UserProfile.findOne({ email });
    
    const totalRecommendations = history.length;
    const recentActivity = history.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length;

    const avgRecommendationsPerWeek = totalRecommendations > 0 ? 
      Math.round(totalRecommendations / Math.max(1, Math.ceil((Date.now() - new Date(history[history.length - 1]?.createdAt || Date.now()).getTime()) / (7 * 24 * 60 * 60 * 1000)))) : 0;

    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently';

    res.json({
      stats: {
        totalRecommendations,
        recentActivity,
        avgRecommendationsPerWeek,
        memberSince,
        hasProfile: !!profile
      }
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ message: 'Error fetching user stats' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
