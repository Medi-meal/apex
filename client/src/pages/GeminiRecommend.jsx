import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Example mapping (expand as needed)
const foodImages = {
  egg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
  chicken: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
  salad: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80",
  fish: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
  rice: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80",
  apple: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=200&q=80",
  banana: "https://images.unsplash.com/photo-1574226516831-e1dff420e8e9?auto=format&fit=crop&w=200&q=80",
  bread: "https://images.unsplash.com/photo-1509440159598-8b9b5cf1c2b1?auto=format&fit=crop&w=200&q=80",
  carrot: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80",
  broccoli: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
  cheese: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
  milk: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  orange: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=200&q=80",
  potato: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=200&q=80",
  tomato: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80",
  spinach: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
  yogurt: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
  // ...add more as needed
};
const defaultFoodImage = "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80";

const splitVegNonVeg = (foods = []) => {
  const nonVegKeywords = ['chicken', 'fish', 'egg', 'mutton', 'beef', 'prawn', 'shrimp', 'meat', 'lamb', 'turkey', 'duck'];
  const veg = [];
  const nonveg = [];
  foods.forEach(food => {
    const lower = food.toLowerCase();
    if (nonVegKeywords.some(word => lower.includes(word))) {
      nonveg.push(food);
    } else {
      veg.push(food);
    }
  });
  return { veg, nonveg };
};

const steps = [
  { name: 'basicInfo', label: 'Basic Information', type: 'basicInfo', required: true },
  { name: 'medication', label: 'Medication', type: 'medication', required: true },
  { name: 'diseaseFood', label: 'Disease & Food Availability', type: 'diseaseFood', required: true },
];

export default function GeminiRecommend() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: '',
    medication: [
      {
        drugName: '',
        dosage: '',
        duration: ''
      }
    ],
    diseaseFood: {
      diseaseDuration: '',
      foodAllergies: '',
      dietaryRestrictions: ''
    },
    gender: '',
    foodType: '',
    bmi: '',
    weight: '',
    height: '',
  });
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bmiCategory, setBmiCategory] = useState('');
  // When recommendations are generated, do not select any meal by default
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [eatenFoods, setEatenFoods] = useState([]);
  const [avoidedFoods, setAvoidedFoods] = useState([]);
  const [showRecommended, setShowRecommended] = useState(false);
  const [showNotRecommended, setShowNotRecommended] = useState(false);
  const recommendedListRef = useRef(null);
  const notRecommendedListRef = useRef(null);
  const mealTabsRef = useRef(null);
  const mealBtnRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [foodQuery, setFoodQuery] = useState('');
  const [foodWarning, setFoodWarning] = useState('');
  const [foodCheckLoading, setFoodCheckLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [foodSuggestions, setFoodSuggestions] = useState([]);
  const [highlightedFood, setHighlightedFood] = useState('');
  const [favoriteFoods, setFavoriteFoods] = useState(() => {
    // Load favorites from localStorage
    try {
      return JSON.parse(localStorage.getItem('favoriteFoods') || '{}');
    } catch {
      return {};
    }
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteFoods', JSON.stringify(favoriteFoods));
  }, [favoriteFoods]);

  // Toggle favorite for a food in a meal
  function toggleFavorite(meal, food) {
    setFavoriteFoods((prev) => {
      const key = `${meal}:${food}`;
      const updated = { ...prev };
      if (updated[key]) delete updated[key];
      else updated[key] = true;
      return updated;
    });
  }

  // Load user details from localStorage if available
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('medimeal_user'));
    console.log('Loading user data on mount:', user);
    
    if (user && user.email) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/user-input?email=${encodeURIComponent(user.email)}`)
        .then((res) => {
          if (res.data.input) {
            const userInput = res.data.input;
            setForm((f) => ({ 
              ...f, 
              ...userInput,
              // Ensure medication is always an array
              medication: Array.isArray(userInput.medication) 
                ? userInput.medication 
                : (userInput.medication && typeof userInput.medication === 'object')
                  ? [userInput.medication]
                  : [{ drugName: '', dosage: '', duration: '' }]
            }));
          }
        })
        .catch((error) => {
          console.error('Error loading user input:', error.response?.data || error.message);
        });
    } else {
      console.warn('No user found in localStorage or missing email');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('medication.')) {
      const parts = name.split('.');
      const index = parseInt(parts[1]);
      const field = parts[2];
      setForm(prev => ({
        ...prev,
        medication: prev.medication.map((med, i) =>
          i === index ? { ...med, [field]: value } : med
        )
      }));
    } else if (name.startsWith('diseaseFood.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        diseaseFood: {
          ...prev.diseaseFood,
          [field]: value
        }
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addMedication = () => {
    setForm(prev => ({
      ...prev,
      medication: [...prev.medication, { drugName: '', dosage: '', duration: '' }]
    }));
  };

  const removeMedication = (index) => {
    setForm(prev => {
      const currentMedications = Array.isArray(prev.medication) ? prev.medication : [{ drugName: '', dosage: '', duration: '' }];
      if (currentMedications.length > 1) {
        return {
          ...prev,
          medication: currentMedications.filter((_, i) => i !== index)
        };
      }
      return prev;
    });
  };

  const handleCalculateBMI = () => {
    const weight = parseFloat(form.weight);
    const height = parseFloat(form.height) / 100;
    if (weight > 0 && height > 0) {
      const bmi = (weight / (height * height)).toFixed(1);
      setForm((f) => ({ ...f, bmi }));
      let category = '';
      if (form.gender === 'Male' || form.gender === 'Female' || form.gender === 'Other') {
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';
      }
      setBmiCategory(category ? `BMI Category (${form.gender}): ${category}` : '');
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (steps[step].name === 'weightHeightBmi' && !form.bmi && form.weight && form.height) {
      handleCalculateBMI();
    }
    setStep((s) => s + 1);
  };

  const handlePrev = () => setStep((s) => s - 1);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMessage('');
    
    try {
      const user = JSON.parse(localStorage.getItem('medimeal_user'));
      if (!user || !user.email) {
        setSaveMessage('Please login to save your profile');
        setSaving(false);
        return;
      }

      // Convert form data to profile format
      const profileData = {
        gender: form.gender,
        age: parseInt(form.age) || null,
        height: parseInt(form.height) || null,
        weight: parseInt(form.weight) || null,
        eaterType: form.foodType,
        medications: form.medication || [],
        diseaseDuration: form.diseaseFood?.diseaseDuration || '',
        allergies: form.diseaseFood?.foodAllergies || '',
        foodRestrictions: form.diseaseFood?.dietaryRestrictions || '',
        bmi: form.weight && form.height ? parseFloat((form.weight / ((form.height/100) ** 2)).toFixed(1)) : null
      };

      // Log Disease & Food Availability data being saved
      console.log('Disease & Food Availability data being saved:', {
        diseaseDuration: profileData.diseaseDuration,
        allergies: profileData.allergies,
        foodRestrictions: profileData.foodRestrictions
      });

      // Save to user profile endpoint
      console.log('Saving profile data:', { email: user.email, profileData });
      const profileResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user-profile`, {
        email: user.email,
        profileData: profileData
      });
      console.log('Profile saved successfully:', profileResponse.data);

      if (profileResponse.status === 200 || profileResponse.status === 201) {
        setSaveMessage('Profile saved successfully! 🎉 Your health data is now stored.');
      } else {
        setSaveMessage('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error.response) {
        setSaveMessage(`Server error: ${error.response.data?.message || error.response.status}`);
      } else if (error.request) {
        setSaveMessage('Network error: Unable to reach server');
      } else {
        setSaveMessage('An error occurred while saving. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/gemini-recommend`, form);
      setResult(res.data);
      const user = JSON.parse(localStorage.getItem('medimeal_user'));
      
      // Debug: Check if user exists and has email
      console.log('User from localStorage:', user);
      
      if (user && user.email) {
        try {
          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user-input`, {
            email: user.email,
            input: form,
            recommendations: { ...res.data, favoriteFoods },
          });
          console.log('User input saved successfully');
        } catch (saveError) {
          console.error('Error saving user input:', saveError.response?.data || saveError.message);
          // Don't fail the whole process if saving fails
        }
      } else {
        console.warn('User not logged in or email missing - skipping save');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error.response?.data || error.message);
      setResult({ error: 'Failed to get recommendations.' });
    }
    setLoading(false);
  };

  const foodType = form.foodType || 'both';

  function handleToggleEaten(food) {
    setEatenFoods((prev) => (prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]));
  }
  function handleToggleAvoided(food) {
    setAvoidedFoods((prev) => (prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]));
  }

  useEffect(() => {
    const idx = ['Breakfast', 'Lunch', 'Dinner'].indexOf(selectedMeal);
    const btn = mealBtnRefs.current[idx];
    if (btn && mealTabsRef.current) {
      const { left: tabsLeft } = mealTabsRef.current.getBoundingClientRect();
      const { left, width } = btn.getBoundingClientRect();
      setIndicatorStyle({ left: left - tabsLeft, width });
    }
  }, [selectedMeal, result]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
      overflow: 'hidden',
    }}>
      {/* Decorative white bubbles for the page background */}
      <div style={{ position: 'absolute', top: 80, left: 40, width: 120, height: 120, background: 'rgba(255,255,255,0.13)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: 400, right: 60, width: 90, height: 90, background: 'rgba(255,255,255,0.10)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: 60, left: 120, width: 140, height: 140, background: 'rgba(255,255,255,0.12)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 180, height: 180, background: 'rgba(255,255,255,0.09)', borderRadius: '50%', zIndex: 0 }} />
      <div
        style={{
          position: 'relative',
          minHeight: '270px',
          width: '100%',
          background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)', // modern blue gradient
          color: '#fff', // white text for heading
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          boxShadow: '0 2px 12px rgba(10,35,66,0.10)',
          marginBottom: 32,
          overflow: 'hidden',
        }}
      >
        {/* Decorative white bubbles */}
        <div style={{ position: 'absolute', top: 30, left: 60, width: 70, height: 70, background: 'rgba(255,255,255,0.18)', borderRadius: '50%', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 120, left: 180, width: 40, height: 40, background: 'rgba(255,255,255,0.13)', borderRadius: '50%', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 60, right: 80, width: 90, height: 90, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: 20, left: 120, width: 50, height: 50, background: 'rgba(255,255,255,0.10)', borderRadius: '50%', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: 40, right: 60, width: 60, height: 60, background: 'rgba(255,255,255,0.12)', borderRadius: '50%', zIndex: 0 }} />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '2.5rem 0 2rem 0',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontWeight: 700,
              fontSize: '2.7rem',
              letterSpacing: '2px',
              marginBottom: 0,
              color: '#fff', // white heading
              textShadow: '0 2px 12px #0a234299',
              position: 'relative',
              zIndex: 2
            }}
          >
            Food Recommendations
          </h1>
          <p
            style={{
              fontSize: '1.18rem',
              fontWeight: 400,
              marginTop: '0.7rem',
              color: '#e3f2fd', // soft blue for subtitle
              textShadow: '0 1px 6px #0a234288',
            }}
          >
            Personalized, health-focused meal plans powered by AI
          </p>
        </div>
      </div>
      
      {/* Input Card for User Details */}
      {!result && (
        <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)' }}>
          <div
            className="gemini-card"
            style={{
              background: '#fff',
              borderRadius: 24,
              boxShadow: '0 4px 32px #2193b033',
              border: '1.5px solid #e3f2fd',
              borderTop: '4px solid #2193b0',
              padding: '2.7rem 2.5rem 2.2rem 2.5rem',
              maxWidth: 800,
              width: '100%',
              margin: '0 1rem',
            }}
          >
            <h2 style={{ textAlign: 'center', width: '100%', color: '#2193b0', fontWeight: 800, fontSize: '2.2rem', marginBottom: 28, letterSpacing: '1px' }}>
              Get Food Recommendations
            </h2>
            
            {/* Progress Indicator */}
            <div style={{ 
              marginBottom: 32, 
              padding: '1.5rem', 
              background: '#f8f9fa', 
              borderRadius: 16, 
              border: '1px solid #e3f2fd' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 12 
              }}>
                <span style={{ 
                  color: '#2193b0', 
                  fontWeight: 700, 
                  fontSize: '1.1rem' 
                }}>
                  Step {step + 1} of {steps.length}
                </span>
                <span style={{ 
                  color: '#4caf50', 
                  fontWeight: 600, 
                  fontSize: '1rem' 
                }}>
                  {Math.round(((step + 1) / steps.length) * 100)}% Complete
                </span>
              </div>
              
              {/* Progress Bar */}
              <div style={{ 
                width: '100%', 
                height: 8, 
                background: '#e3f2fd', 
                borderRadius: 4, 
                overflow: 'hidden',
                marginBottom: 16
              }}>
                <div style={{ 
                  width: `${((step + 1) / steps.length) * 100}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              
              {/* Step Icons */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  opacity: step >= 0 ? 1 : 0.4 
                }}>
                  <span style={{ fontSize: '1.5rem', marginBottom: 4 }}>👤</span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 600, 
                    color: step >= 0 ? '#2193b0' : '#9e9e9e' 
                  }}>
                    Basic Info
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  opacity: step >= 1 ? 1 : 0.4 
                }}>
                  <span style={{ fontSize: '1.5rem', marginBottom: 4 }}>💊</span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 600, 
                    color: step >= 1 ? '#2193b0' : '#9e9e9e' 
                  }}>
                    Medications
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  opacity: step >= 2 ? 1 : 0.4 
                }}>
                  <span style={{ fontSize: '1.5rem', marginBottom: 4 }}>🍽️</span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 600, 
                    color: step >= 2 ? '#2193b0' : '#9e9e9e' 
                  }}>
                    Disease & Food
                  </span>
                </div>
              </div>
            </div>
            
            <form onSubmit={step === steps.length - 1 ? handleSubmit : handleNext} style={{ width: '100%', marginTop: 0 }}>
              {(() => {
                const s = steps[step];
                if (s.type === 'basicInfo') {
                  return (
                    <div style={{ marginBottom: 18 }}>
                      <label
                        style={{ color: '#2193b0', fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, display: 'block', letterSpacing: '0.01em' }}
                      >
                        Basic Information
                      </label>
                      
                      {/* Gender Field */}
                      <div style={{ marginBottom: 18 }}>
                        <label
                          style={{ color: '#2193b0', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, display: 'block' }}
                          htmlFor="gender"
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          required={true}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            borderRadius: 10,
                            border: '1.5px solid #90caf9',
                            fontSize: '1rem',
                            background: '#e3f2fd',
                            color: '#0a2342',
                            marginBottom: 8,
                            boxShadow: '0 1px 4px #2193b022',
                            outline: 'none',
                            transition: 'border 0.2s, box-shadow 0.2s',
                          }}
                          onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                          onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Age Field */}
                      <div style={{ marginBottom: 18 }}>
                        <label
                          style={{ color: '#2193b0', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, display: 'block' }}
                          htmlFor="age"
                        >
                          Age (years)
                        </label>
                        <input
                          id="age"
                          name="age"
                          type="number"
                          placeholder="Enter your age"
                          value={form.age}
                          onChange={handleChange}
                          required={true}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            borderRadius: 10,
                            border: '1.5px solid #90caf9',
                            fontSize: '1rem',
                            background: '#e3f2fd',
                            color: '#0a2342',
                            marginBottom: 8,
                            boxShadow: '0 1px 4px #2193b022',
                            outline: 'none',
                            transition: 'border 0.2s, box-shadow 0.2s',
                          }}
                          onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                          onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                        />
                      </div>

                      {/* Height and Weight Fields */}
                      <div style={{ marginBottom: 18 }}>
                        <label
                          style={{ color: '#2193b0', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, display: 'block' }}
                        >
                          Height & Weight
                        </label>
                        <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '0.7rem' }}>
                          <input
                            id="height"
                            name="height"
                            type="number"
                            step="0.1"
                            placeholder="Enter height in cm"
                            value={form.height}
                            onChange={handleChange}
                            style={{
                              width: '50%',
                              padding: '0.7rem 1.1rem',
                              borderRadius: 10,
                              border: '1.5px solid #90caf9',
                              fontSize: '1rem',
                              background: '#e3f2fd',
                              color: '#0a2342',
                              marginBottom: 8,
                              boxShadow: '0 1px 4px #2193b022',
                              outline: 'none',
                              transition: 'border 0.2s, box-shadow 0.2s',
                            }}
                            onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                            onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                          />
                          <input
                            id="weight"
                            name="weight"
                            type="number"
                            step="0.1"
                            placeholder="Enter weight in kg"
                            value={form.weight}
                            onChange={handleChange}
                            style={{
                              width: '50%',
                              padding: '0.7rem 1.1rem',
                              borderRadius: 10,
                              border: '1.5px solid #90caf9',
                              fontSize: '1rem',
                              background: '#e3f2fd',
                              color: '#0a2342',
                              marginBottom: 8,
                              boxShadow: '0 1px 4px #2193b022',
                              outline: 'none',
                              transition: 'border 0.2s, box-shadow 0.2s',
                            }}
                            onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                            onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                          />
                          <button
                            type="button"
                            onClick={handleCalculateBMI}
                            style={{
                              background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 10,
                              padding: '0.7rem 1.3rem',
                              fontWeight: 600,
                              fontSize: '1rem',
                              cursor: 'pointer',
                              marginLeft: 8,
                              boxShadow: '0 1px 4px #2193b022',
                              transition: 'background 0.2s',
                            }}
                          >
                            Calculate BMI
                          </button>
                        </div>
                        {form.bmi && (
                          <input
                            name="bmi"
                            type="number"
                            step="0.1"
                            placeholder="BMI (optional)"
                            value={form.bmi}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '0.7rem 1.1rem',
                              borderRadius: 10,
                              border: '1.5px solid #90caf9',
                              fontSize: '1rem',
                              background: '#e3f2fd',
                              color: '#0a2342',
                              marginBottom: 8,
                              boxShadow: '0 1px 4px #2193b022',
                              outline: 'none',
                              transition: 'border 0.2s, box-shadow 0.2s',
                            }}
                            onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                            onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                          />
                        )}
                      </div>

                      {/* Type of Eater Field */}
                      <div style={{ marginBottom: 18 }}>
                        <label
                          style={{ color: '#2193b0', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, display: 'block' }}
                          htmlFor="foodType"
                        >
                          Type of Eater
                        </label>
                        <select
                          id="foodType"
                          name="foodType"
                          value={form.foodType}
                          onChange={handleChange}
                          required={true}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            borderRadius: 10,
                            border: '1.5px solid #90caf9',
                            fontSize: '1rem',
                            background: '#e3f2fd',
                            color: '#0a2342',
                            marginBottom: 8,
                            boxShadow: '0 1px 4px #2193b022',
                            outline: 'none',
                            transition: 'border 0.2s, box-shadow 0.2s',
                          }}
                          onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                          onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                        >
                          <option value="">Select your preference</option>
                          <option value="veg">veg</option>
                          <option value="nonveg">nonveg</option>
                          <option value="vegan">vegan</option>
                          <option value="both">both</option>
                        </select>
                      </div>
                    </div>
                  );
                }
                if (s.type === 'medication') {
                  // Ensure medication is always an array
                  const medications = Array.isArray(form.medication) ? form.medication : [{ drugName: '', dosage: '', duration: '' }];
                  
                  return (
                    <div style={{ marginBottom: 18 }}>
                      {medications.map((med, index) => (
                        <div key={index} style={{ 
                          marginBottom: 20, 
                          padding: '1rem', 
                          border: '1px solid #e3f2fd', 
                          borderRadius: 12,
                          background: '#fafbfc'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: 12 
                          }}>
                            <label
                              style={{ color: '#2193b0', fontWeight: 700, fontSize: '1.08rem', marginBottom: 0, letterSpacing: '0.01em' }}
                            >
                              Medication {index + 1}
                            </label>
                            {medications.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMedication(index)}
                                style={{
                                  background: '#ffebee',
                                  color: '#d32f2f',
                                  border: '1px solid #ffcdd2',
                                  borderRadius: 6,
                                  padding: '0.3rem 0.6rem',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label
                              style={{ color: '#2193b0', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, display: 'block' }}
                              htmlFor={`medication.${index}.drugName`}
                            >
                              Drug Name
                            </label>
                            <input
                              id={`medication.${index}.drugName`}
                              name={`medication.${index}.drugName`}
                              type="text"
                              placeholder="e.g., Metformin"
                              value={med?.drugName || ''}
                              onChange={handleChange}
                              required={s.required}
                              style={{
                                width: '100%',
                                padding: '0.7rem 1.1rem',
                                borderRadius: 10,
                                border: '1.5px solid #90caf9',
                                fontSize: '1rem',
                                background: '#e3f2fd',
                                color: '#0a2342',
                                marginBottom: 8,
                                boxShadow: '0 1px 4px #2193b022',
                                outline: 'none',
                                transition: 'border 0.2s, box-shadow 0.2s',
                              }}
                              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                              onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                            />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label
                              style={{ color: '#2193b0', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, display: 'block' }}
                              htmlFor={`medication.${index}.dosage`}
                            >
                              Dosage
                            </label>
                            <input
                              id={`medication.${index}.dosage`}
                              name={`medication.${index}.dosage`}
                              type="text"
                              placeholder="e.g., 500mg twice daily"
                              value={med?.dosage || ''}
                              onChange={handleChange}
                              required={s.required}
                              style={{
                                width: '100%',
                                padding: '0.7rem 1.1rem',
                                borderRadius: 10,
                                border: '1.5px solid #90caf9',
                                fontSize: '1rem',
                                background: '#e3f2fd',
                                color: '#0a2342',
                                marginBottom: 8,
                                boxShadow: '0 1px 4px #2193b022',
                                outline: 'none',
                                transition: 'border 0.2s, box-shadow 0.2s',
                              }}
                              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                              onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                            />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label
                              style={{ color: '#2193b0', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, display: 'block' }}
                              htmlFor={`medication.${index}.duration`}
                            >
                              Duration
                            </label>
                            <input
                              id={`medication.${index}.duration`}
                              name={`medication.${index}.duration`}
                              type="text"
                              placeholder="e.g., 6 months"
                              value={med?.duration || ''}
                              onChange={handleChange}
                              required={s.required}
                              style={{
                                width: '100%',
                                padding: '0.7rem 1.1rem',
                                borderRadius: 10,
                                border: '1.5px solid #90caf9',
                                fontSize: '1rem',
                                background: '#e3f2fd',
                                color: '#0a2342',
                                marginBottom: 8,
                                boxShadow: '0 1px 4px #2193b022',
                                outline: 'none',
                                transition: 'border 0.2s, box-shadow 0.2s',
                              }}
                              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                              onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addMedication}
                        style={{
                          background: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 10,
                          padding: '0.7rem 1.5rem',
                          fontWeight: 600,
                          fontSize: '1rem',
                          cursor: 'pointer',
                          width: '100%',
                          marginTop: 8,
                          boxShadow: '0 1px 4px #4caf5022',
                          transition: 'background 0.2s',
                        }}
                      >
                        + Add Medication
                      </button>
                    </div>
                  );
                }
                if (s.type === 'diseaseFood') {
                  return (
                    <div style={{ marginBottom: 18 }}>
                      <label
                        style={{ color: '#2193b0', fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, display: 'block', letterSpacing: '0.01em' }}
                      >
                        🍽️ Disease & Food Availability
                      </label>
                      
                      {/* Disease Duration Field */}
                      <div style={{ marginBottom: 18 }}>
                        <label
                          style={{ color: '#2193b0', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, display: 'block' }}
                          htmlFor="diseaseFood.diseaseDuration"
                        >
                          Disease Duration
                        </label>
                        <input
                          id="diseaseFood.diseaseDuration"
                          name="diseaseFood.diseaseDuration"
                          type="text"
                          placeholder="e.g., 2 years, 6 months, Recently diagnosed"
                          value={form.diseaseFood?.diseaseDuration || ''}
                          onChange={handleChange}
                          required={s.required}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            borderRadius: 10,
                            border: '1.5px solid #90caf9',
                            fontSize: '1rem',
                            background: '#e3f2fd',
                            color: '#0a2342',
                            marginBottom: 8,
                            boxShadow: '0 1px 4px #2193b022',
                            outline: 'none',
                            transition: 'border 0.2s, box-shadow 0.2s',
                          }}
                          onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                          onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                        />
                      </div>

                      {/* Food Allergies Field */}
                      <div style={{ marginBottom: 18 }}>
                        <label
                          style={{ color: '#2193b0', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, display: 'block' }}
                          htmlFor="diseaseFood.foodAllergies"
                        >
                          Food Allergies
                        </label>
                        <textarea
                          id="diseaseFood.foodAllergies"
                          name="diseaseFood.foodAllergies"
                          placeholder="List any food allergies you have (e.g., nuts, shellfish, dairy, eggs, etc.)"
                          value={form.diseaseFood?.foodAllergies || ''}
                          onChange={handleChange}
                          required={s.required}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            borderRadius: 10,
                            border: '1.5px solid #90caf9',
                            fontSize: '1rem',
                            background: '#e3f2fd',
                            color: '#0a2342',
                            marginBottom: 8,
                            boxShadow: '0 1px 4px #2193b022',
                            outline: 'none',
                            transition: 'border 0.2s, box-shadow 0.2s',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                          }}
                          onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                          onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                        />
                      </div>

                      {/* Dietary Restrictions Field */}
                      <div style={{ marginBottom: 18 }}>
                        <label
                          style={{ color: '#2193b0', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, display: 'block' }}
                          htmlFor="diseaseFood.dietaryRestrictions"
                        >
                          Dietary Restrictions
                        </label>
                        <textarea
                          id="diseaseFood.dietaryRestrictions"
                          name="diseaseFood.dietaryRestrictions"
                          placeholder="Any foods you avoid for religious, cultural, or personal reasons (e.g., beef, pork, alcohol, gluten, etc.)"
                          value={form.diseaseFood?.dietaryRestrictions || ''}
                          onChange={handleChange}
                          required={s.required}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            borderRadius: 10,
                            border: '1.5px solid #90caf9',
                            fontSize: '1rem',
                            background: '#e3f2fd',
                            color: '#0a2342',
                            marginBottom: 8,
                            boxShadow: '0 1px 4px #2193b022',
                            outline: 'none',
                            transition: 'border 0.2s, box-shadow 0.2s',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                          }}
                          onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                          onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <div style={{ marginBottom: 18 }}>
                    <label
                      style={{ color: '#2193b0', fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, display: 'block', letterSpacing: '0.01em' }}
                      htmlFor={s.name}
                    >
                      {s.label}
                    </label>
                    <input
                      id={s.name}
                      name={s.name}
                      type={s.type}
                      placeholder={s.name === 'age' ? 'Enter your age' : s.label}
                      value={form[s.name]}
                      onChange={handleChange}
                      required={s.required}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1.1rem',
                        borderRadius: 10,
                        border: '1.5px solid #90caf9', // soft blue border
                        fontSize: '1rem',
                        background: '#e3f2fd', // light blue background
                        color: '#0a2342',
                        marginBottom: 8,
                        boxShadow: '0 1px 4px #2193b022',
                        outline: 'none',
                        transition: 'border 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2193b055'}
                      onBlur={e => e.target.style.boxShadow = '0 1px 4px #2193b022'}
                    />
                  </div>
                );
              })()}
              {step === 3 && form.weight && form.height && (() => {
                const weight = parseFloat(form.weight);
                const height = parseFloat(form.height) / 100;
                if (weight > 0 && height > 0) {
                  const bmi = (weight / (height * height)).toFixed(1);
                  let category = '';
                  let bmiRange = '';
                  
                  // Gender-specific BMI categories
                  if (form.gender === 'Male') {
                    if (bmi < 18.5) {
                      category = 'Underweight';
                      bmiRange = 'Below 18.5';
                    } else if (bmi < 25) {
                      category = 'Normal weight';
                      bmiRange = '18.5 - 24.9';
                    } else if (bmi < 30) {
                      category = 'Overweight';
                      bmiRange = '25.0 - 29.9';
                    } else {
                      category = 'Obese';
                      bmiRange = '30.0 and above';
                    }
                  } else if (form.gender === 'Female') {
                    if (bmi < 18.5) {
                      category = 'Underweight';
                      bmiRange = 'Below 18.5';
                    } else if (bmi < 24) {
                      category = 'Normal weight';
                      bmiRange = '18.5 - 23.9';
                    } else if (bmi < 29) {
                      category = 'Overweight';
                      bmiRange = '24.0 - 28.9';
                    } else {
                      category = 'Obese';
                      bmiRange = '29.0 and above';
                    }
                  } else {
                    // For 'Other' or unspecified gender, use standard ranges
                    if (bmi < 18.5) {
                      category = 'Underweight';
                      bmiRange = 'Below 18.5';
                    } else if (bmi < 25) {
                      category = 'Normal weight';
                      bmiRange = '18.5 - 24.9';
                    } else if (bmi < 30) {
                      category = 'Overweight';
                      bmiRange = '25.0 - 29.9';
                    } else {
                      category = 'Obese';
                      bmiRange = '30.0 and above';
                    }
                  }
                  
                  return (
                    <div style={{
                      margin: '1rem 0',
                      padding: '1rem 1.5rem',
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                      color: '#2193b0',
                      borderRadius: 12,
                      fontWeight: 600,
                      fontSize: '1.08rem',
                      boxShadow: '0 2px 8px #2193b022',
                      border: '1px solid #90caf9'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>📊 BMI Calculator</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600 }}>Your BMI:</span>
                          <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{bmi}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600 }}>Category:</span>
                          <span style={{ 
                            fontWeight: 600, 
                            color: category === 'Normal weight' ? '#4caf50' : 
                                   category === 'Underweight' ? '#ff9800' : 
                                   category === 'Overweight' ? '#ff5722' : '#f44336'
                          }}>
                            {category}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600 }}>Range ({form.gender || 'Standard'}):</span>
                          <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#607d8b' }}>{bmiRange}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              <div style={{ display: 'flex', justifyContent: step > 0 ? 'space-between' : 'flex-end', gap: 12 }}>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    style={{
                      background: '#e3f2fd',
                      color: '#2193b0',
                      border: 'none',
                      borderRadius: 25,
                      padding: '0.7rem 2rem',
                      fontWeight: 600,
                      fontSize: '1.05rem',
                      cursor: 'pointer',
                    }}
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 25,
                    padding: '0.7rem 2rem',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                  }}
                >
                  {step === steps.length - 1 ? (loading ? 'Loading...' : 'Get Recommendations') : 'Next'}
                </button>
              </div>
              
              {/* Save Profile Button - Only show on last step */}
              {step === steps.length - 1 && !loading && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{
                      background: saving
                        ? 'linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 100%)'
                        : 'linear-gradient(90deg, #16a34a 0%, #4ade80 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 25,
                      padding: '0.7rem 2rem',
                      fontWeight: 600,
                      fontSize: '1.05rem',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(34,197,94,0.12)',
                      marginTop: '1rem'
                    }}
                  >
                    {saving ? 'Saving Profile...' : '💾 Save Profile'}
                  </button>
                  {saveMessage && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.8rem 1.2rem',
                      borderRadius: 12,
                      background: saveMessage.includes('successfully') 
                        ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' 
                        : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                      color: saveMessage.includes('successfully') ? '#1a7e23' : '#d32f2f',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      border: `1px solid ${saveMessage.includes('successfully') ? '#4caf50' : '#f44336'}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {saveMessage}
                    </div>
                  )}
                </div>
                             )}
            </form>
          </div>
        </div>
      )}
      {result && (
        <div className="recommend-results" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/profile')}
              style={{
                background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(33, 147, 176, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(33, 147, 176, 0.4)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(33, 147, 176, 0.3)';
              }}
            >
              <span role="img" aria-label="profile">👤</span> View Profile
            </button>

          </div>

          {/* Food Safety Check Section - Above Meal Tabs */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: 20,
            padding: '2rem',
            margin: '0 auto 2rem auto',
            boxShadow: '0 4px 24px rgba(33, 147, 176, 0.08)',
            border: '1px solid #e3f2fd',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: 600
          }}>
            {/* Subtle background pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 100,
              height: 100,
              background: 'radial-gradient(circle, rgba(33, 147, 176, 0.03) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(25px, -25px)'
            }} />
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                borderRadius: 12,
                padding: '0.7rem',
                boxShadow: '0 2px 8px rgba(33, 147, 176, 0.2)'
              }}>
                <span style={{ 
                  fontSize: '1.6rem',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }}>🔍</span>
              </div>
              <div>
                <h3 style={{
                  color: '#0a2342',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  Food Safety Check
                </h3>
                <p style={{
                  color: '#607d8b',
                  fontSize: '0.9rem',
                  margin: '0.2rem 0 0 0',
                  fontWeight: 400
                }}>
                  Check if a specific food is safe for your condition
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-end',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  color: '#2193b0',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.3px'
                }}>
                  Food Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., chicken, rice, spinach..."
                  value={foodQuery}
                  onChange={(e) => setFoodQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.1rem',
                    borderRadius: 12,
                    border: '2px solid #e3f2fd',
                    fontSize: '1rem',
                    background: '#ffffff',
                    color: '#0a2342',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(33, 147, 176, 0.05)'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#2193b0';
                    e.target.style.boxShadow = '0 0 0 3px rgba(33, 147, 176, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e3f2fd';
                    e.target.style.boxShadow = '0 2px 8px rgba(33, 147, 176, 0.05)';
                  }}
                />
              </div>
              <button
                onClick={async () => {
                  if (foodQuery.trim()) {
                    setFoodCheckLoading(true);
                    try {
                      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/gemini-recommend`, {
                        foodQuery: foodQuery.trim(),
                        userProfile: form
                      });
                      if (response.data.safety) {
                        setFoodWarning(`✅ ${foodQuery} is safe to eat!`);
                      } else {
                        setFoodWarning(`⚠️ ${foodQuery} may not be safe for your condition.`);
                      }
                    } catch (error) {
                      setFoodWarning('❌ Error checking food safety. Please try again.');
                    }
                    setFoodCheckLoading(false);
                  }
                }}
                disabled={foodCheckLoading || !foodQuery.trim()}
                style={{
                  padding: '0.9rem 1.8rem',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: foodCheckLoading || !foodQuery.trim() 
                    ? '#f5f5f5' 
                    : 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                  color: foodCheckLoading || !foodQuery.trim() ? '#9e9e9e' : '#ffffff',
                  cursor: foodCheckLoading || !foodQuery.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: foodCheckLoading || !foodQuery.trim() 
                    ? 'none' 
                    : '0 4px 12px rgba(33, 147, 176, 0.3)',
                  minWidth: '110px',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={e => {
                  if (!foodCheckLoading && foodQuery.trim()) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(33, 147, 176, 0.4)';
                  }
                }}
                onMouseLeave={e => {
                  if (!foodCheckLoading && foodQuery.trim()) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(33, 147, 176, 0.3)';
                  }
                }}
              >
                {foodCheckLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid transparent',
                      borderTop: '2px solid currentColor',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Checking...
                  </span>
                ) : 'Check Safety'}
              </button>
            </div>
            
            {/* Food Warning Message */}
            {foodWarning && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1.1rem 1.4rem',
                borderRadius: 12,
                background: foodWarning.includes('✅') 
                  ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' 
                  : foodWarning.includes('⚠️') 
                    ? 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)' 
                    : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                color: foodWarning.includes('✅') ? '#1a7e23' : foodWarning.includes('⚠️') ? '#e65100' : '#d32f2f',
                fontSize: '0.95rem',
                fontWeight: 500,
                border: `1px solid ${foodWarning.includes('✅') ? '#4caf50' : foodWarning.includes('⚠️') ? '#ff9800' : '#f44336'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                position: 'relative',
                zIndex: 1
              }}>
                <span style={{ fontSize: '1.1rem' }}>
                  {foodWarning.includes('✅') ? '✅' : foodWarning.includes('⚠️') ? '⚠️' : '❌'}
                </span>
                <span>{foodWarning.replace(/^[✅⚠️❌]\s*/, '')}</span>
              </div>
            )}
            
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>

          <div className="meal-tabs" ref={mealTabsRef} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '0', marginBottom: '2.5rem', position: 'relative', width: '100%', background: '#f5fafd', borderRadius: 32, boxShadow: '0 2px 16px #2193b022', padding: '0.5rem 0.5rem', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            {['Breakfast', 'Lunch', 'Dinner'].map((meal, idx) => {
              const icons = { Breakfast: '☀️', Lunch: '🌞', Dinner: '🌙' };
              const isSelected = selectedMeal === meal;
              return (
                <button
                  key={meal}
                  ref={(el) => (mealBtnRefs.current[idx] = el)}
                  className={`meal-tab${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelectedMeal(meal)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    padding: '0.7rem 2.2rem',
                    borderRadius: 24,
                    border: 'none',
                    background: isSelected ? 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' : 'transparent',
                    color: isSelected ? '#fff' : '#2193b0',
                    boxShadow: isSelected ? '0 2px 12px #2193b044' : 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    marginRight: idx < 2 ? 16 : 0,
                    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                    borderLeft: idx > 0 ? '1.5px solid #e3f2fd' : 'none',
                  }}
                  aria-pressed={isSelected}
                >
                  <span style={{ fontSize: '1.35rem', marginRight: 6 }}>{icons[meal]}</span>
                  {meal}
                </button>
              );
            })}
            {/* Animated indicator */}
            <div className="meal-tab-indicator" style={indicatorStyle} />
          </div>
          

          {selectedMeal && result[selectedMeal?.toLowerCase()] ? (
            <div className="meal-output-card fade-in" style={{ maxWidth: 540, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 18px #0a234211', padding: '2rem 2rem 1.5rem 2rem', position: 'relative' }}>
              <h3 style={{ color: '#0a2342', fontWeight: 700, fontSize: '1.5rem', marginBottom: 18, textAlign: 'center', letterSpacing: '1px' }}>{selectedMeal}</h3>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h4 style={{ color: '#1a7e23', fontWeight: 700, fontSize: '1.1rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: '#e8f5e9', color: '#1a7e23', borderRadius: 8, padding: '2px 10px', fontSize: '0.98rem', fontWeight: 700 }}>Recommended</span>
                  </h4>
                  <ul className="gemini-food-list">
                    {result[selectedMeal.toLowerCase()]?.recommended?.map((item, idx) => {
                      const key = `${selectedMeal}:${item.food}`;
                      const isFav = !!favoriteFoods[key];
                      return (
                        <li key={idx} className="gemini-food-item" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, background: '#f8fafc', borderRadius: 10, padding: '0.7rem 1rem', boxShadow: '0 1px 4px #0a234211' }}>
                          <button
                            onClick={() => toggleFavorite(selectedMeal, item.food)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: isFav ? '#FFD700' : '#b0bec5', marginRight: 6 }}
                            title={isFav ? 'Remove from favorites' : 'Save as favorite'}
                          >
                            {isFav ? '★' : '☆'}
                          </button>
                          <span style={{ fontWeight: 600, color: '#0a2342', fontSize: '1.08rem', flex: 1 }}>{item.food}</span>
                          <span style={{ color: '#607d8b', fontSize: '0.98rem', fontWeight: 500, marginRight: 10 }}>{item.quantity}</span>
                          <span style={{ background: '#e8f5e9', color: '#1a7e23', borderRadius: 6, padding: '2px 8px', fontSize: '1.1rem', fontWeight: 700 }}>✔</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h4 style={{ color: '#b71c1c', fontWeight: 700, fontSize: '1.1rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: '#ffebee', color: '#b71c1c', borderRadius: 8, padding: '2px 10px', fontSize: '0.98rem', fontWeight: 700 }}>Not Recommended</span>
                  </h4>
                  <ul className="gemini-food-list">
                    {result[selectedMeal.toLowerCase()]?.not_recommended?.map((food, idx) => (
                      <li
                        key={idx}
                        className="gemini-food-item"
                        style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, background: highlightedFood && food.toLowerCase().includes(highlightedFood) ? '#ffebee' : '#f8fafc', borderRadius: 10, padding: '0.7rem 1rem', boxShadow: '0 1px 4px #0a234211', animation: highlightedFood && food.toLowerCase().includes(highlightedFood) ? 'shake 0.4s' : undefined }}
                      >
                        <span style={{ fontWeight: 600, color: '#b71c1c', fontSize: '1.08rem', flex: 1 }}>{food}</span>
                        <span style={{ background: '#ffebee', color: '#b71c1c', borderRadius: 6, padding: '2px 8px', fontSize: '1.1rem', fontWeight: 700 }}>✖</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function FoodItem({ food, icon, type }) {
  const [active, setActive] = useState(false);
  const [showTip, setShowTip] = useState(false);
  let tip = '';
  if (type === 'recommended') tip = 'Tap to mark as eaten';
  else if (type === 'not_recommended') tip = 'Tap to mark as avoided';
  else tip = 'Tap to mark as eaten';
  return (
    <li
      style={{
        fontSize: '1.13rem',
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 1.2rem',
        borderBottom: type === 'not_recommended' ? '1px solid #fbeaea' : '1px solid #e0e7ef',
        borderRadius: 14,
        background: active ? (type === 'not_recommended' ? '#fca5a5' : '#bbf7d0') : 'none',
        color: active ? '#fff' : undefined,
        boxShadow: active ? '0 2px 12px #0a234233' : undefined,
        cursor: 'pointer',
        marginBottom: 2,
        position: 'relative',
        transition: 'background 0.25s, color 0.25s, box-shadow 0.25s, transform 0.18s',
        touchAction: 'manipulation',
        minHeight: 48,
      }}
      onClick={() => {
        setActive(true);
        setTimeout(() => setActive(false), 400);
      }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onTouchStart={() => setShowTip(true)}
      onTouchEnd={() => setShowTip(false)}
    >
      <span style={{ marginRight: 12, fontSize: 26 }}>{icon}</span> {food}
      {showTip && (
        <span
          style={{
            position: 'absolute',
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#0a2342',
            color: '#fff',
            fontSize: '0.97rem',
            borderRadius: 8,
            padding: '0.3rem 0.7rem',
            marginLeft: 10,
            whiteSpace: 'nowrap',
            zIndex: 10,
            boxShadow: '0 2px 8px #0a234233',
          }}
        >
          {tip}
        </span>
      )}
    </li>
  );
}





