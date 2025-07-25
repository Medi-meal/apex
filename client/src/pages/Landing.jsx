import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Landing = ({ showAbout, setShowAbout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    if (location.state?.showAbout) {
      setShowAbout(true);
    }
  }, [location.state, setShowAbout]);

  useEffect(() => {
    if (showAbout && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showAbout]);

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Recommendations",
      description: "Advanced AI analyzes your health and medication for safe meal suggestions."
    },
    {
      icon: "💊",
      title: "Personalized to Your Medication",
      description: "Get food advice tailored to your prescriptions and health profile."
    },
    {
      icon: "✅",
      title: "Eat or Avoid Guidance",
      description: "Clear recommendations on what to eat and what to avoid."
    },
    {
      icon: "🔬",
      title: "Science-Backed Nutrition",
      description: "All suggestions are based on the latest nutrition science."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Tell us about your health conditions, medications, and dietary preferences."
    },
    {
      number: "02",
      title: "Get AI Analysis",
      description: "Our advanced AI analyzes your profile for personalized recommendations."
    },
    {
      number: "03",
      title: "Receive Meal Plans",
      description: "Get customized meal plans that work with your medication and health goals."
    }
  ];

  const faqs = [
    {
      question: "How does Medimeal recommend food?",
      answer: "Our AI analyzes your medication, health conditions, and preferences to suggest what you should eat or avoid."
    },
    {
      question: "Is Medimeal only for people on medication?",
      answer: "No! Anyone can use Medimeal, but it is especially helpful for those with specific health or medication needs."
    },
    {
      question: "Can Medimeal help me avoid food-drug interactions?",
      answer: "Yes. Our platform is designed to flag foods that may interact with your medication and suggest safer alternatives."
    },
    {
      question: "Are the recommendations personalized?",
      answer: "Absolutely. Every suggestion is tailored to your unique health profile and updated as your details change."
    }
  ];

  return (
    <div className="landing-page" style={{ minHeight: '100vh', backgroundColor: 'var(--secondary-50)' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
        color: 'white',
        padding: 'var(--space-24) 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <div className="fade-in">
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              marginBottom: 'var(--space-6)',
              letterSpacing: '-0.02em'
            }}>
              Medimeal
            </h1>
            <p style={{
              fontSize: '1.5rem',
              marginBottom: 'var(--space-8)',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '600px',
              margin: '0 auto var(--space-8) auto'
            }}>
              Your Health, Your Meal – Powered by AI
            </p>
            <p style={{
              fontSize: '1.125rem',
              marginBottom: 'var(--space-10)',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '700px',
              margin: '0 auto var(--space-10) auto'
            }}>
              Discover a new way to eat healthy, delicious meals tailored to your unique health needs. 
              Let Medimeal's AI guide you to a happier, healthier you!
            </p>
            <button 
              className="btn btn-lg"
              style={{
                backgroundColor: 'white',
                color: 'var(--primary-600)',
                padding: 'var(--space-4) var(--space-10)',
                fontSize: '1.125rem',
                fontWeight: '600',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-xl)'
              }}
              onClick={() => navigate('/signup')}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: 'var(--space-24) 0', backgroundColor: 'white' }}>
        <div className="container">
          <div className="text-center slide-up" style={{ marginBottom: 'var(--space-16)' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--secondary-900)', marginBottom: 'var(--space-4)' }}>
              Why Choose Medimeal?
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--secondary-600)', maxWidth: '600px', margin: '0 auto' }}>
              Personalized nutrition recommendations powered by cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid grid-cols-4" style={{ gap: 'var(--space-8)' }}>
            {features.map((feature, index) => (
              <div key={index} className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: 'var(--space-4)',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  color: 'var(--secondary-900)', 
                  marginBottom: 'var(--space-3)' 
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: 'var(--secondary-600)', 
                  fontSize: '0.875rem',
                  lineHeight: '1.6' 
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: 'var(--space-24) 0', backgroundColor: 'var(--secondary-50)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--secondary-900)', marginBottom: 'var(--space-4)' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--secondary-600)', maxWidth: '600px', margin: '0 auto' }}>
              Get personalized meal recommendations in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-3" style={{ gap: 'var(--space-12)' }}>
            {steps.map((step, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-600)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 auto var(--space-6) auto',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  {step.number}
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  color: 'var(--secondary-900)', 
                  marginBottom: 'var(--space-3)' 
                }}>
                  {step.title}
                </h3>
                <p style={{ 
                  color: 'var(--secondary-600)', 
                  fontSize: '1rem',
                  lineHeight: '1.6' 
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: 'var(--space-24) 0',
        background: 'linear-gradient(135deg, var(--success-600) 0%, var(--success-800) 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '2.5rem', 
            marginBottom: 'var(--space-6)',
            fontWeight: '700'
          }}>
            Ready to Transform Your Health?
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: 'var(--space-8)',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '600px',
            margin: '0 auto var(--space-8) auto'
          }}>
            Join thousands of users who have improved their health with personalized meal recommendations.
          </p>
          <button 
            className="btn btn-lg"
            style={{
              backgroundColor: 'white',
              color: 'var(--success-600)',
              padding: 'var(--space-4) var(--space-10)',
              fontSize: '1.125rem',
              fontWeight: '600',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={() => navigate('/signup')}
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      {showAbout && (
        <section ref={aboutRef} style={{ padding: 'var(--space-24) 0', backgroundColor: 'white' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--secondary-900)', marginBottom: 'var(--space-4)' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--secondary-600)' }}>
                Everything you need to know about Medimeal
              </p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {faqs.map((faq, index) => (
                <div key={index} className="card" style={{ marginBottom: 'var(--space-4)' }}>
                  <div 
                    style={{ 
                      padding: 'var(--space-6)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      color: 'var(--secondary-900)',
                      margin: 0
                    }}>
                      {faq.question}
                    </h3>
                    <span style={{ 
                      fontSize: '1.5rem',
                      color: 'var(--primary-600)',
                      transform: openFaq === index ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}>
                      +
                    </span>
                  </div>
                  {openFaq === index && (
                    <div style={{ 
                      padding: '0 var(--space-6) var(--space-6) var(--space-6)',
                      borderTop: '1px solid var(--secondary-200)'
                    }}>
                      <p style={{ 
                        color: 'var(--secondary-600)',
                        margin: 0,
                        lineHeight: '1.6'
                      }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Landing;

