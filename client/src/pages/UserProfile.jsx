import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserProfile() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const user = JSON.parse(localStorage.getItem('medimeal_user'));

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.email) {
        try {
          // Set a timeout to prevent infinite loading
          const timeoutId = setTimeout(() => {
            setLoading(false);
          }, 5000); // 5 second timeout

          // Fetch user history
          const historyPromise = axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-input/history?email=${encodeURIComponent(user.email)}`)
            .then(res => {
              setHistory(res.data.history || []);
            })
            .catch(err => {
              console.error('Error fetching history:', err);
              setHistory([]); // Set empty array on error
            });

          // Fetch user stats from database
          const statsPromise = axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-stats?email=${encodeURIComponent(user.email)}`)
            .then(res => {
              setStats(res.data.stats || {});
            })
            .catch(err => {
              console.error('Error fetching stats:', err);
              setStats({}); // Set empty object on error
            });

          // Fetch user profile
          const profilePromise = axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-profile?email=${encodeURIComponent(user.email)}`)
            .then(res => {
              if (res.data && res.data.profile) {
                setUserProfile(res.data.profile); // set to flat object
              }
            })
            .catch(err => {
              console.error('Error fetching profile:', err);
              setUserProfile(null); // Set null on error
            });

          // Wait for all requests or timeout
          await Promise.allSettled([historyPromise, statsPromise, profilePromise]);
          clearTimeout(timeoutId);
          setLoading(false);
        } catch (error) {
          console.error('Error in data fetching:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderInput(input) {
    if (Array.isArray(input)) {
      return input.join('');
    } else if (typeof input === 'object' && input !== null) {
      return Object.entries(input).map(([key, value]) => (
        <div key={key} style={{ marginBottom: 'var(--space-1)' }}>
          <span style={{ fontWeight: '600', color: 'var(--secondary-700)' }}>{key}:</span>{' '}
          <span style={{ color: 'var(--secondary-600)' }}>{value}</span>
        </div>
      ));
    } else {
      return input;
    }
  }

  const handleTabClick = (tabId) => {
    console.log('handleTabClick called with:', tabId);
    console.log('Current activeTab:', activeTab);
    setActiveTab(tabId);
    console.log('Tab should change to:', tabId);
  };

  const getDashboardStats = () => {
    // Use database stats if available, otherwise calculate from history
    if (stats.totalSubmissions !== undefined) {
      return {
        totalRecommendations: stats.totalSubmissions || 0,
        streak: stats.streak || 0,
        avgRecommendationsPerWeek: stats.avgRecommendationsPerWeek || 0,
        memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently',
        avgCalories: stats.avgCalories || 0,
        avgProteins: stats.avgProteins || 0,
        avgCarbs: stats.avgCarbs || 0,
        avgFats: stats.avgFats || 0,
        bmi: userProfile?.bmi || 'Not available',
        healthGoal: userProfile?.healthGoal || 'Not set'
      };
    }

    // Fallback to calculating from history if database stats not available
    const totalRecommendations = history.length;
    // Calculate streak from history (number of consecutive days with activity)
    let streak = 0;
    if (history.length > 0) {
      let prevDate = new Date(history[0].createdAt);
      streak = 1;
      for (let i = 1; i < history.length; i++) {
        const currDate = new Date(history[i].createdAt);
        const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak++;
          prevDate = currDate;
        } else if (diffDays > 1) {
          break;
        }
      }
    }

    const avgRecommendationsPerWeek = totalRecommendations > 0 ? Math.round(totalRecommendations / Math.max(1, Math.ceil((Date.now() - new Date(history[history.length - 1]?.createdAt || Date.now()).getTime()) / (7 * 24 * 60 * 60 * 1000)))) : 0;

    return {
      totalRecommendations,
      streak,
      avgRecommendationsPerWeek,
      memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'
    };
  };

  const dashboardData = getDashboardStats();

  const StatCard = ({ icon, title, value, subtitle, color = 'var(--primary-600)' }) => (
    <div className="card fade-in" style={{
      padding: 'var(--space-6)',
      textAlign: 'center',
      border: `2px solid ${color}15`,
      backgroundColor: `${color}05`
    }}>
      <div style={{
        fontSize: '2rem',
        marginBottom: 'var(--space-3)',
        color: color
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--secondary-900)',
        marginBottom: 'var(--space-1)'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'var(--secondary-700)',
        marginBottom: 'var(--space-1)'
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--secondary-500)'
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Tab clicked:', id);
        onClick(id);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        backgroundColor: isActive ? 'var(--primary-600)' : 'transparent',
        color: isActive ? 'white' : 'var(--secondary-600)',
        border: isActive ? 'none' : '1px solid var(--secondary-200)',
        borderRadius: 'var(--radius-lg)',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
      onMouseDown={(e) => {
        // Fallback for stubborn clicks
        if (e.button === 0) { // Left click only
          console.log('Mouse down on tab:', id);
          onClick(id);
        }
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.backgroundColor = 'var(--secondary-100)';
          e.target.style.borderColor = 'var(--secondary-300)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.borderColor = 'var(--secondary-200)';
        }
      }}
    >
      <span style={{ 
        pointerEvents: 'none',
        userSelect: 'none'
      }}>{icon}</span>
      <span style={{ 
        pointerEvents: 'none',
        userSelect: 'none'
      }}>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--secondary-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--secondary-200)',
            borderTop: '4px solid var(--primary-600)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: 'var(--secondary-600)', margin: 0 }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // At the top of the return, show error message and Try Again button if error
  // The error block is removed, so this section is no longer relevant.

  // At the bottom of the profile page, add a feedback form
  // Remove all feedback form state and handlers
  // Remove the feedback form <div> at the bottom of the profile page
  // If you want to keep the 'Give Feedback' button, leave it; otherwise, remove it as well.

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--secondary-50)',
      padding: 'var(--space-6) 0'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--secondary-200)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-6)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: '700',
              boxShadow: 'var(--shadow-lg)'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--secondary-900)',
                marginBottom: 'var(--space-2)'
              }}>
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p style={{
                color: 'var(--secondary-600)',
                fontSize: '1rem',
                margin: 0
              }}>
                {user?.email} • Member since {dashboardData.memberSince}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4" style={{ gap: 'var(--space-4)' }}>
            <StatCard
              icon="📊"
              title="Total Recommendations"
              value={dashboardData.totalRecommendations}
              subtitle="All time"
              color="var(--primary-600)"
            />
            <StatCard
              icon="🔥"
              title="Streak"
              value={dashboardData.streak}
              subtitle="Consecutive days active"
              color="var(--warning-600)"
            />
            <StatCard
              icon="📈"
              title="Weekly Average"
              value={dashboardData.avgRecommendationsPerWeek}
              subtitle="Recommendations per week"
              color="var(--success-600)"
            />
            <StatCard
              icon="⭐"
              title="Health Score"
              value="85%"
              subtitle="Based on your activity"
              color="var(--primary-600)"
              className="pulse"
            />
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
          position: 'relative',
          zIndex: 5
        }}>
          <TabButton
            id="overview"
            label="Overview"
            icon="📋"
            isActive={activeTab === 'overview'}
            onClick={handleTabClick}
          />
          <TabButton
            id="health"
            label="Health Insights"
            icon="💡"
            isActive={activeTab === 'health'}
            onClick={handleTabClick}
          />
          <button
            onClick={() => navigate('/feedback')}
            style={{
              background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: 'var(--space-3) var(--space-4)',
              cursor: 'pointer',
              marginLeft: 8,
              boxShadow: '0 1px 4px #2193b022',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              transition: 'all 0.2s ease',
            }}
          >
            <span role="img" aria-label="feedback">💬</span> Give Feedback
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2" style={{ gap: 'var(--space-6)' }}>
            {/* Recent Activity */}
            <div className="card fade-in">
              <div className="card-header">
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--secondary-900)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <span>🕒</span>
                  Recent Activity
                </h3>
              </div>
              <div className="card-body">
                {(() => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  const recentEntries = history.filter(entry => new Date(entry.createdAt) >= weekAgo).slice(0, 3);
                  if (recentEntries.length === 0) {
                    return (
                      <div style={{
                        textAlign: 'center',
                        color: 'var(--secondary-500)',
                        fontSize: '0.875rem',
                        padding: 'var(--space-8)'
                      }}>
                        No recent activity. Start by getting your first recommendation!
                      </div>
                    );
                  }
                  return recentEntries.map((entry, idx) => (
                    <div key={entry._id || idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3)',
                      backgroundColor: 'var(--secondary-50)',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: idx < 2 ? 'var(--space-3)' : 0
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--success-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        🍽️
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: 'var(--secondary-900)',
                          marginBottom: 'var(--space-1)'
                        }}>
                          Meal Recommendation
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--secondary-500)'
                        }}>
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Health Profile Card */}
            <div className="card fade-in">
              <div className="card-header">
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--primary-700)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <span role="img" aria-label="health">🩺</span>
                  Health Profile
                </h3>
              </div>
              <div className="card-body">
                {userProfile ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div><span style={{ color: '#111' }}><strong>Gender:</strong></span> {userProfile.gender || '-'}</div>
                    <div><span style={{ color: '#111' }}><strong>Age:</strong></span> {userProfile.age || '-'}</div>
                    <div><span style={{ color: '#111' }}><strong>Height:</strong></span> {userProfile.height ? userProfile.height + ' cm' : '-'}</div>
                    <div><span style={{ color: '#111' }}><strong>Weight:</strong></span> {userProfile.weight ? userProfile.weight + ' kg' : '-'}</div>
                    <div><span style={{ color: '#111' }}><strong>Type of Eater:</strong></span> {userProfile.eaterType || '-'}</div>
                    <div><span style={{ color: '#111' }}><strong>BMI:</strong></span> {userProfile.bmi || '-'}</div>
                    <div><span style={{ color: '#111' }}><strong>Allergies:</strong></span> {userProfile.allergies || '-'}</div>
                    <div><span style={{ color: '#111' }}><strong>Food Restrictions:</strong></span> {userProfile.foodRestrictions || '-'}</div>
                  </div>
                ) : (
                  <div style={{ color: 'var(--secondary-500)' }}>No health profile data found.</div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card fade-in">
              <div className="card-header">
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--secondary-900)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <span>⚡</span>
                  Quick Actions
                </h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <button
                    onClick={() => navigate('/recommendations')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-4)',
                      backgroundColor: 'var(--primary-50)',
                      border: '1px solid var(--primary-200)',
                      borderRadius: 'var(--radius-lg)',
                      color: 'var(--primary-700)',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-100)';
                      e.target.style.borderColor = 'var(--primary-300)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-50)';
                      e.target.style.borderColor = 'var(--primary-200)';
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>🤖</span>
                    <div>
                      <div style={{ fontWeight: '600' }}>Get AI Recommendations</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Discover personalized meal suggestions</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="grid grid-cols-2" style={{ gap: 'var(--space-6)' }}>
            {/* Health Metrics */}
            <div className="card fade-in" style={{
              background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
              boxShadow: '0 4px 24px 0 rgba(0, 188, 212, 0.10)',
              border: 'none',
            }}>
              <div className="card-header">
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#006064',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <span role="img" aria-label="metrics">📊</span>
                  Health Metrics
                </h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-3)',
                    background: 'linear-gradient(90deg, #fffde7 0%, #fff9c4 100%)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 2px 8px 0 rgba(255, 235, 59, 0.10)'
                  }}>
                    <span style={{ color: '#fbc02d', fontWeight: '600' }}>Nutrition Score</span>
                    <span style={{ color: '#fbc02d', fontWeight: '700', fontSize: '1.125rem' }}>85%</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-3)',
                    background: 'linear-gradient(90deg, #e1f5fe 0%, #b3e5fc 100%)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 2px 8px 0 rgba(33, 150, 243, 0.10)'
                  }}>
                    <span style={{ color: '#0288d1', fontWeight: '600' }}>Medication Compliance</span>
                    <span style={{ color: '#0288d1', fontWeight: '700', fontSize: '1.125rem' }}>92%</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-3)',
                    background: 'linear-gradient(90deg, #f3e5f5 0%, #ce93d8 100%)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 2px 8px 0 rgba(156, 39, 176, 0.10)'
                  }}>
                    <span style={{ color: '#8e24aa', fontWeight: '600' }}>Weekly Goals Met</span>
                    <span style={{ color: '#8e24aa', fontWeight: '700', fontSize: '1.125rem' }}>4/5</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-3)',
                    background: 'linear-gradient(90deg, #e8f5e9 0%, #a5d6a7 100%)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 2px 8px 0 rgba(76, 175, 80, 0.10)'
                  }}>
                    <span style={{ color: '#388e3c', fontWeight: '600' }}>Streak</span>
                    <span style={{ color: '#388e3c', fontWeight: '700', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span role="img" aria-label="fire">🔥</span> {stats?.streak || 0} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Tips */}
            <div className="card fade-in" style={{
              background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
              boxShadow: '0 4px 24px 0 rgba(233, 30, 99, 0.10)',
              border: 'none',
            }}>
              <div className="card-header">
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#ad1457',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <span role="img" aria-label="tips">💡</span>
                  Personalized Tips
                </h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{
                    padding: 'var(--space-4)',
                    background: 'linear-gradient(90deg, #e1bee7 0%, #ba68c8 100%)',
                    borderLeft: '4px solid #8e24aa',
                    borderRadius: 'var(--radius-lg)',
                    color: '#6a1b9a'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: 'var(--space-1)' }}>
                      Great Progress!
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      You've been consistent with your meal recommendations this week.
                    </div>
                  </div>
                  <div style={{
                    padding: 'var(--space-4)',
                    background: 'linear-gradient(90deg, #fffde7 0%, #fff9c4 100%)',
                    borderLeft: '4px solid #fbc02d',
                    borderRadius: 'var(--radius-lg)',
                    color: '#fbc02d'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: 'var(--space-1)' }}>
                      Tip of the Day
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6d4c41' }}>
                      Try incorporating more leafy greens into your meals for better nutrient absorption.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {stats.streak !== undefined && stats.lastStreakDate && (
        (() => {
          const last = new Date(stats.lastStreakDate);
          const now = new Date();
          const isToday = last.getFullYear() === now.getFullYear() && last.getMonth() === now.getMonth() && last.getDate() === now.getDate();
          return (
            <div style={{
              margin: '1.5rem 0',
              padding: '1rem 1.5rem',
              background: isToday ? '#e8f5e9' : '#fffde7',
              color: isToday ? '#388e3c' : '#fbc02d',
              borderRadius: 10,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '1.1rem',
              boxShadow: '0 1px 4px #0a234211'
            }}>
              {isToday ? (
                <>
                  <span style={{fontSize: '1.3rem'}}>✅</span>
                  You’ve continued your streak today!
                </>
              ) : (
                <>
                  <span style={{fontSize: '1.3rem'}}>⚠️</span>
                  Don’t lose your streak! Get active today.
                </>
              )}
            </div>
          );
        })()
      )}

      {/* Add global compatibility styles at the top of the file (or in a <style> block at the bottom) */}
      <style>{`
        html, body {
          text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        .match-parent-align {
          text-align: match-parent;
          text-align: -webkit-match-parent;
          text-align: inherit;
        }
        /* Use print-color-adjust for Chrome/Edge instead of color-adjust */
        .print-color-adjust {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
      `}</style>

    </div>
  );
}





