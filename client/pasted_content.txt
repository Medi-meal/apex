const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = '772559724147-utfpmphmr81s84n2eao0fnl7likdp79r.apps.googleusercontent.com';

const User = require('./models/User');
const UserInput = require('./models/UserInput');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({ message: 'Signup successful' });
  } catch (err) {
    console.error(err); // <--- Add this line to see errors in your terminal
    res.status(500).json({ message: 'Server error' });
  }
});
// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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
  const { email, input, recommendations } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  // Convert recommendations object to text summary
  const recommendationsText = recommendationsToText(recommendations);
  try {
    const newInput = await UserInput.create({ email, input, recommendations: recommendationsText });
    res.json({ message: 'Saved', data: newInput });
  } catch (err) {
    res.status(500).json({ message: 'Error saving input' });
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

// Google Login Route
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'No token provided' });
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    if (!email) return res.status(400).json({ message: 'No email in Google account' });
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, password: '' });
      await user.save();
    }
    res.json({ email, name });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));