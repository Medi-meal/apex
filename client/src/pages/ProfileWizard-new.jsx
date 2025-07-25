import React, { useState } from 'react';

const initialProfile = {
  gender: '',
  age: '',
  height: '',
  weight: '',
  eaterType: '',
  medications: [{ name: '', dosage: '', duration: '' }],
  diseaseDuration: '',
  unavailableFoods: [],
};

const steps = [
  'Basic Info',
  'Medications',
  'Disease & Food Availability',
  'Review',
];

export default function ProfileWizard() {
  const [profile, setProfile] = useState(initialProfile);
  const [step, setStep] = useState(0);

  const handleChange = (field, value) => setProfile(p => ({ ...p, [field]: value }));
  const handleMedChange = (idx, field, value) => {
    const meds = [...profile.medications];
    meds[idx][field] = value;
    setProfile(p => ({ ...p, medications: meds }));
  };
  const addMedication = () => setProfile(p => ({ ...p, medications: [...p.medications, { name: '', dosage: '', duration: '' }] }));
  const removeMedication = idx => setProfile(p => ({ ...p, medications: profile.medications.filter((_, i) => i !== idx) }));
  const handleUnavailableFood = food => {
    setProfile(p => ({ ...p, unavailableFoods: p.unavailableFoods.includes(food) ? p.unavailableFoods.filter(f => f !== food) : [...p.unavailableFoods, food] }));
  };
  const bmi = profile.height && profile.weight ? (profile.weight / ((profile.height/100) ** 2)).toFixed(1) : '';

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
      backgroundColor: '#f8fafc',
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
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Health Profile Setup
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            Help us personalize your meal recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Step {step + 1} of {steps.length}
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              {Math.round(((step + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div style={{
            width: '100%',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((step + 1) / steps.length) * 100}%`,
              backgroundColor: '#22c55e',
              height: '100%',
              transition: 'width 0.3s ease',
              borderRadius: '4px'
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
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: idx <= step ? '#22c55e' : '#e5e7eb',
                  color: idx <= step ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  transition: 'all 0.3s ease'
                }}>
                  {idx < step ? '✓' : idx + 1}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: idx <= step ? '#22c55e' : '#6b7280',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  {stepName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '1.5rem'
        }}>
          {step === 0 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>👤</span>
                Basic Information
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Gender</label>
                  <select 
                    value={profile.gender} 
                    onChange={e => handleChange('gender', e.target.value)} 
                    required
                    style={{
                      ...inputStyle,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Age (years)</label>
                  <input 
                    type="number" 
                    value={profile.age} 
                    onChange={e => handleChange('age', e.target.value)} 
                    required
                    placeholder="Enter your age"
                    style={inputStyle}
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Height (cm)</label>
                  <input 
                    type="number" 
                    value={profile.height} 
                    onChange={e => handleChange('height', e.target.value)} 
                    required
                    placeholder="Enter height in cm"
                    style={inputStyle}
                  />
                </div>

                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Weight (kg)</label>
                  <input 
                    type="number" 
                    value={profile.weight} 
                    onChange={e => handleChange('weight', e.target.value)} 
                    required
                    placeholder="Enter weight in kg"
                    style={inputStyle}
                  />
                </div>
              </div>

              {bmi && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#166534'
                  }}>
                    <span>📊</span>
                    Your BMI: <span style={{ fontSize: '1.125rem' }}>{bmi}</span>
                  </div>
                </div>
              )}

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Type of Eater</label>
                <select 
                  value={profile.eaterType} 
                  onChange={e => handleChange('eaterType', e.target.value)} 
                  required
                  style={{
                    ...inputStyle,
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select your preference</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>💊</span>
                Medications
              </h2>
              
              {profile.medications.map((med, idx) => (
                <div key={idx} style={{
                  padding: '1.5rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  marginBottom: '1rem'
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
                      color: '#374151',
                      margin: 0
                    }}>
                      Medication {idx + 1}
                    </h3>
                    {profile.medications.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeMedication(idx)}
                        style={{
                          ...buttonStyle,
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          padding: '0.5rem'
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
                      <label style={labelStyle}>Drug Name</label>
                      <input 
                        placeholder="e.g., Metformin" 
                        value={med.name} 
                        onChange={e => handleMedChange(idx, 'name', e.target.value)} 
                        required 
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Dosage</label>
                      <input 
                        placeholder="e.g., 500mg twice daily" 
                        value={med.dosage} 
                        onChange={e => handleMedChange(idx, 'dosage', e.target.value)} 
                        required 
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Duration</label>
                      <input 
                        placeholder="e.g., 6 months" 
                        value={med.duration} 
                        onChange={e => handleMedChange(idx, 'duration', e.target.value)} 
                        required 
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={addMedication}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#22c55e',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>+</span>
                Add Medication
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>🏥</span>
                Disease & Food Availability
              </h2>
              
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Disease Duration</label>
                <input 
                  value={profile.diseaseDuration} 
                  onChange={e => handleChange('diseaseDuration', e.target.value)} 
                  required 
                  placeholder="e.g., 2 years"
                  style={inputStyle}
                />
              </div>
              
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Unavailable Foods</label>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '1rem'
                }}>
                  Click on foods that you cannot eat or are allergic to:
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {['Milk', 'Eggs', 'Wheat', 'Peanuts', 'Soy', 'Fish', 'Chicken', 'Rice', 'Potato', 'Tomato'].map(food => (
                    <button 
                      key={food} 
                      type="button" 
                      onClick={() => handleUnavailableFood(food)}
                      style={{
                        ...buttonStyle,
                        backgroundColor: profile.unavailableFoods.includes(food) ? '#fee2e2' : '#f3f4f6',
                        color: profile.unavailableFoods.includes(food) ? '#dc2626' : '#374151',
                        border: profile.unavailableFoods.includes(food) ? '2px solid #dc2626' : '2px solid #e5e7eb'
                      }}
                    >
                      {food}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>📋</span>
                Review Your Profile
              </h2>
              
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <pre style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  overflow: 'auto',
                  margin: 0
                }}>
                  {JSON.stringify({ ...profile, bmi }, null, 2)}
                </pre>
              </div>
              
              <button 
                type="button" 
                style={{
                  ...buttonStyle,
                  backgroundColor: '#22c55e',
                  color: 'white',
                  width: '100%',
                  padding: '1rem'
                }}
              >
                Save Profile
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {step > 0 ? (
            <button 
              onClick={() => setStep(s => s - 1)}
              style={{
                ...buttonStyle,
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #e5e7eb'
              }}
            >
              ← Back
            </button>
          ) : (
            <div></div>
          )}
          
          {step < steps.length - 1 && (
            <button 
              onClick={() => setStep(s => s + 1)}
              style={{
                ...buttonStyle,
                backgroundColor: '#22c55e',
                color: 'white'
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
