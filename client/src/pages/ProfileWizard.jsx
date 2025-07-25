import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const initialProfile = {
  gender: '',
  age: '',
  height: '',
  weight: '',
  eaterType: '',
  medications: [{ name: '', dosage: '', duration: '' }],
  diseaseDuration: '',
  allergies: '',
  foodRestrictions: '',
};

const steps = [
  'Basic Info',
  'Medications',
  'Disease & Food Availability',
  'Review',
];

export default function ProfileWizard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialProfile);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (field, value) => setProfile(p => ({ ...p, [field]: value }));
  const handleMedChange = (idx, field, value) => {
    const meds = [...profile.medications];
    meds[idx][field] = value;
    setProfile(p => ({ ...p, medications: meds }));
  };
  const addMedication = () => setProfile(p => ({ ...p, medications: [...p.medications, { name: '', dosage: '', duration: '' }] }));
  const removeMedication = idx => setProfile(p => ({ ...p, medications: profile.medications.filter((_, i) => i !== idx) }));
  const bmi = profile.height && profile.weight ? (profile.weight / ((profile.height/100) ** 2)).toFixed(1) : '';

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

      const profileData = {
        ...profile,
        bmi: parseFloat(bmi) || null,
        age: parseInt(profile.age) || null,
        height: parseInt(profile.height) || null,
        weight: parseInt(profile.weight) || null
      };

      // Save to user profile endpoint
      console.log('Saving profile data:', { email: user.email, profileData });
      const profileResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user-profile`, {
        email: user.email,
        profileData: profileData
      });
      console.log('Profile saved successfully:', profileResponse.data);

      // Skip the user-input save for now since profile is saved successfully
      // const inputResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user-input`, {
      //   email: user.email,
      //   input: profileData,
      //   recommendations: 'Health profile saved'
      // });

      if (profileResponse.status === 200 || profileResponse.status === 201) {
        setSaveMessage('Profile saved successfully! 🎉');
        // Navigate to profile page after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setSaveMessage('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response) {
        // Server responded with error status
        setSaveMessage(`Server error: ${error.response.data?.message || error.response.status}`);
      } else if (error.request) {
        // Request made but no response received
        setSaveMessage('Network error: Unable to reach server');
      } else {
        // Other error
        setSaveMessage('An error occurred while saving. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.875rem',
    transition: 'border-color 0.2s ease',
    backgroundColor: 'white'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const fieldGroupStyle = {
    marginBottom: '1.5rem'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #f8fafc 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#0288d1',
            marginBottom: '0.5rem',
            background: 'linear-gradient(90deg, #0288d1 0%, #26c6da 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>
            <span role="img" aria-label="profile">🩺</span> Health Profile Setup
          </h1>
          <p style={{
            color: '#4dd0e1',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            Help us personalize your meal recommendations
          </p>
        </div>

        {/* Progress Bar & Stepper */}
        <div style={{
          background: 'linear-gradient(90deg, #ffffff 60%, #e1f5fe 100%)',
          borderRadius: '16px',
          padding: '2rem 1.5rem 1.5rem 1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 12px rgba(2,136,209,0.07)',
          border: '1px solid #b3e5fc'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <span style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#0288d1'
            }}>
              Step {step + 1} of {steps.length}
            </span>
            <span style={{
              fontSize: '1rem',
              color: '#4dd0e1',
              fontWeight: '600'
            }}>
              {Math.round(((step + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div style={{
            width: '100%',
            backgroundColor: '#b3e5fc',
            borderRadius: '6px',
            height: '10px',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: `${((step + 1) / steps.length) * 100}%`,
              background: 'linear-gradient(90deg, #0288d1 0%, #26c6da 100%)',
              height: '100%',
              transition: 'width 0.3s cubic-bezier(.4,2,.6,1)',
              borderRadius: '6px'
            }}></div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1rem'
          }}>
            {steps.map((stepName, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: idx <= step ? 'linear-gradient(135deg, #0288d1 0%, #26c6da 100%)' : '#e0f7fa',
                  color: idx <= step ? 'white' : '#0288d1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  boxShadow: idx <= step ? '0 2px 8px rgba(2,136,209,0.15)' : 'none',
                  border: idx <= step ? '2px solid #26c6da' : '2px solid #b3e5fc',
                  transition: 'all 0.3s ease'
                }}>
                  {idx === 0 ? '👤' : idx === 1 ? '💊' : idx === 2 ? '🍽️' : idx === 3 ? '✅' : idx + 1}
                </div>
                <span style={{
                  fontSize: '0.85rem',
                  color: idx <= step ? '#0288d1' : '#81d4fa',
                  fontWeight: '600',
                  textAlign: 'center',
                  letterSpacing: '0.01em'
                }}>
                  {stepName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 60%, #e0f7fa 100%)',
          borderRadius: '18px',
          padding: '2.5rem',
          boxShadow: '0 2px 16px rgba(2,136,209,0.08)',
          border: '1px solid #b3e5fc',
          marginBottom: '2rem'
        }}>
          {step === 0 && (
            <div>
              <h2 style={{
                fontSize: '1.6rem',
                fontWeight: '700',
                color: '#0288d1',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                letterSpacing: '0.01em'
              }}>
                <span>👤</span>
                Basic Information
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#0288d1', marginBottom: '0.5rem' }}>Gender</label>
                  <select 
                    value={profile.gender} 
                    onChange={e => handleChange('gender', e.target.value)} 
                    required
                    style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#0288d1', marginBottom: '0.5rem' }}>Age (years)</label>
                  <input 
                    type="number" 
                    value={profile.age} 
                    onChange={e => handleChange('age', e.target.value)} 
                    required
                    placeholder="Enter your age"
                    style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#0288d1', marginBottom: '0.5rem' }}>Height (cm)</label>
                  <input 
                    type="number" 
                    value={profile.height} 
                    onChange={e => handleChange('height', e.target.value)} 
                    required
                    placeholder="Enter height in cm"
                    style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#0288d1', marginBottom: '0.5rem' }}>Weight (kg)</label>
                  <input 
                    type="number" 
                    value={profile.weight} 
                    onChange={e => handleChange('weight', e.target.value)} 
                    required
                    placeholder="Enter weight in kg"
                    style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                  />
                </div>
              </div>
              {bmi && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)',
                  borderRadius: '10px',
                  border: '1.5px solid #4dd0e1',
                  color: '#0288d1',
                  fontWeight: '700',
                  boxShadow: '0 1px 4px rgba(2,136,209,0.04)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                  }}>
                    <span>📊</span>
                    Your BMI: <span style={{ fontSize: '1.25rem' }}>{bmi}</span>
                  </div>
                </div>
              )}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#0288d1', marginBottom: '0.5rem' }}>Type of Eater</label>
                <select 
                  value={profile.eaterType} 
                  onChange={e => handleChange('eaterType', e.target.value)} 
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                >
                  <option value="">Select your preference</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Both">Both (Mixed Diet)</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0288d1',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                letterSpacing: '0.01em'
              }}>
                <span>💊</span>
                Medications
              </h2>
              {profile.medications.map((med, idx) => (
                <div key={idx} style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)',
                  borderRadius: '10px',
                  border: '1.5px solid #b3e5fc',
                  marginBottom: '1rem',
                  boxShadow: '0 1px 4px rgba(2,136,209,0.04)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#0288d1',
                      margin: 0
                    }}>
                      Medication {idx + 1}
                    </h3>
                    {profile.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(idx)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          background: 'linear-gradient(90deg, #fee2e2 0%, #fecaca 100%)',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div>
                      <label style={{ color: '#0288d1', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Drug Name</label>
                      <input
                        placeholder="e.g., Metformin"
                        value={med.name}
                        onChange={e => handleMedChange(idx, 'name', e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#0288d1', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Dosage</label>
                      <input
                        placeholder="e.g., 500mg twice daily"
                        value={med.dosage}
                        onChange={e => handleMedChange(idx, 'dosage', e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                      />
                    </div>
                    <div>
                      <label style={{ color: '#0288d1', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Duration</label>
                      <input
                        placeholder="e.g., 6 months"
                        value={med.duration}
                        onChange={e => handleMedChange(idx, 'duration', e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMedication}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  background: 'linear-gradient(90deg, #0288d1 0%, #26c6da 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 4px rgba(2,136,209,0.08)',
                  marginTop: '1rem'
                }}
              >
                + Add Medication
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0288d1',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                letterSpacing: '0.01em'
              }}>
                <span>🏥</span>
                Disease & Food Availability
              </h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#0288d1', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Disease Duration</label>
                <input
                  value={profile.diseaseDuration}
                  onChange={e => handleChange('diseaseDuration', e.target.value)}
                  required
                  placeholder="e.g., 2 years, 6 months, Recently diagnosed"
                  style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#0288d1', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Food Allergies</label>
                <textarea
                  value={profile.allergies}
                  onChange={e => handleChange('allergies', e.target.value)}
                  placeholder="List any food allergies you have (e.g., nuts, shellfish, dairy, eggs, etc.)"
                  style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', minHeight: '80px', resize: 'vertical', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#0288d1', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Dietary Restrictions</label>
                <textarea
                  value={profile.foodRestrictions}
                  onChange={e => handleChange('foodRestrictions', e.target.value)}
                  placeholder="Any foods you avoid for religious, cultural, or personal reasons (e.g., beef, pork, alcohol, gluten, etc.)"
                  style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #b3e5fc', borderRadius: '8px', fontSize: '0.9rem', background: '#e0f7fa', color: '#0288d1', fontWeight: '600', outline: 'none', minHeight: '80px', resize: 'vertical', boxShadow: '0 1px 4px rgba(2,136,209,0.04)' }}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0288d1',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                letterSpacing: '0.01em'
              }}>
                <span>📋</span>
                Review Your Profile
              </h2>
              <div style={{
                display: 'grid',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                {/* Basic Information */}
                <div style={{
                  background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  border: '1.5px solid #b3e5fc',
                  marginBottom: '1rem',
                  boxShadow: '0 1px 4px rgba(2,136,209,0.04)'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0288d1',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>👤</span>
                    Basic Information
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Gender:</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{profile.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Age:</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{profile.age ? `${profile.age} years` : 'Not specified'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Height:</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{profile.height ? `${profile.height} cm` : 'Not specified'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Weight:</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{profile.weight ? `${profile.weight} kg` : 'Not specified'}</p>
                    </div>
                    {bmi && (
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>BMI:</span>
                        <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#22c55e' }}>{bmi}</p>
                      </div>
                    )}
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Diet Type:</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{profile.eaterType || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                {/* Medications */}
                <div style={{
                  background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  border: '1.5px solid #b3e5fc',
                  marginBottom: '1rem',
                  boxShadow: '0 1px 4px rgba(2,136,209,0.04)'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0288d1',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>💊</span>
                    Medications
                  </h3>
                  {profile.medications.filter(med => med.name).length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {profile.medications.filter(med => med.name).map((med, idx) => (
                        <div key={idx} style={{
                          padding: '1rem',
                          background: '#e0f7fa',
                          borderRadius: '6px',
                          border: '1px solid #b3e5fc'
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Drug:</span>
                              <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{med.name}</p>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Dosage:</span>
                              <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{med.dosage}</p>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Duration:</span>
                              <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{med.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No medications specified</p>
                  )}
                </div>
                {/* Disease & Food Information */}
                <div style={{
                  background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  border: '1.5px solid #b3e5fc',
                  marginBottom: '1rem',
                  boxShadow: '0 1px 4px rgba(2,136,209,0.04)'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0288d1',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>🏥</span>
                    Disease & Food Availability
                  </h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Disease Duration:</span>
                    <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{profile.diseaseDuration || 'Not specified'}</p>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Food Allergies:</span>
                    <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{profile.allergies || 'None specified'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Dietary Restrictions:</span>
                    <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#111827' }}>{profile.foodRestrictions || 'None specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div> {/* End of Form Content */}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.5rem'
        }}>
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                background: 'linear-gradient(90deg, #e0eafc 0%, #b3e5fc 100%)',
                color: '#0288d1',
                border: '1.5px solid #b3e5fc',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 4px rgba(2,136,209,0.04)'
              }}
            >
              ← Back
            </button>
          ) : <div></div>}

          {step < steps.length - 1 && (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                background: 'linear-gradient(90deg, #0288d1 0%, #26c6da 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 4px rgba(2,136,209,0.08)'
              }}
            >
              Next →
            </button>
          )}

          {step === steps.length - 1 && (
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                background: saving
                  ? 'linear-gradient(90deg, #b3e5fc 0%, #e0eafc 100%)'
                  : 'linear-gradient(90deg, #16a34a 0%, #4ade80 100%)',
                color: 'white',
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 4px rgba(34,197,94,0.12)'
              }}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}