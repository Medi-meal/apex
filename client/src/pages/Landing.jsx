import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Diabetes Patient",
    content: "Medimeal helped me understand which foods work best with my medication. My blood sugar is more stable than ever!",
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Heart Patient",
    content: "The personalized meal plans are incredible. I've lost 20 pounds and feel amazing while staying safe with my heart medication.",
    avatar: "MC"
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Nutritionist",
    content: "I recommend Medimeal to all my patients. The science-backed approach to nutrition and medication interaction is outstanding.",
    avatar: "ER"
  }
];

const Landing = ({ showAbout, setShowAbout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(null);
  const aboutRef = useRef(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [fade, setFade] = useState(true);

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

  // Animate fade-in on testimonial change
  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timeout);
  }, [testimonialIndex]);

  // Carousel navigation
  const nextTestimonial = () => setTestimonialIndex((testimonialIndex + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIndex((testimonialIndex - 1 + testimonials.length) % testimonials.length);

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
    <div className="landing-page" style={{ minHeight: '100vh', backgroundColor: 'var(--secondary-50)', scrollBehavior: 'smooth' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
        color: 'white',
        padding: 'var(--space-24) 0',
        textAlign: 'center',
        position: 'relative', // Add for absolute bubbles
        overflow: 'hidden',
      }}>
        {/* Animated Water Balloons (Bubbles) */}
        <div className="bubble" style={{ top: 40, left: 80, width: 120, height: 120 }} />
        <div className="bubble" style={{ top: 120, right: 100, width: 80, height: 80 }} />
        <div className="bubble" style={{ bottom: 60, left: 180, width: 90, height: 90 }} />
        <div className="bubble" style={{ bottom: 30, right: 60, width: 140, height: 140 }} />
        <div className="bubble" style={{ top: 60, left: 320, width: 70, height: 70 }} />
        <div className="bubble" style={{ bottom: 120, right: 220, width: 100, height: 100 }} />
        <div className="bubble" style={{ top: 180, right: 320, width: 60, height: 60 }} />
        <div className="container">
          <div className="fade-in">
            <h1 style={{
              fontSize: '4.5rem',
              fontWeight: '700',
              marginBottom: 'var(--space-6)',
              letterSpacing: '-0.02em'
            }}>
              Medimeal
            </h1>
            <p style={{
              fontSize: '2.1rem',
              marginBottom: 'var(--space-8)',
              color: 'rgba(255, 255, 255, 0.93)',
              maxWidth: '700px',
              margin: '0 auto var(--space-8) auto',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}>
              Your Health, Your Meal – Powered by AI
            </p>
            <p style={{
              fontSize: '1.35rem',
              marginBottom: 'var(--space-10)',
              color: 'rgba(255, 255, 255, 0.88)',
              maxWidth: '800px',
              margin: '0 auto var(--space-10) auto',
              fontWeight: 500,
              lineHeight: 1.5,
            }}>
              Discover a new way to eat healthy, delicious meals tailored to your unique health needs. <br />
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
      <section id="features" style={{ padding: 'var(--space-24) 0', backgroundColor: 'white' }}>
        <div className="container">
          <div className="text-center slide-up" style={{ marginBottom: 'var(--space-16)' }}>
            <h2 style={{ fontSize: '2.7rem', color: 'var(--secondary-900)', marginBottom: 'var(--space-4)', fontWeight: 800, letterSpacing: '-1px' }}>
              Why Choose Medimeal?
            </h2>
            <p style={{ fontSize: '1.5rem', color: 'var(--secondary-600)', maxWidth: '700px', margin: '0 auto', fontWeight: 500 }}>
              Personalized nutrition recommendations powered by cutting-edge AI technology
            </p>
          </div>
          <div className="grid grid-cols-4" style={{ gap: 72 }}>
            {features.map((feature, index) => (
              <div key={index} className="card" style={{ textAlign: 'center', padding: '2rem 1.2rem', minHeight: 260, minWidth: 260, maxWidth: 260, borderRadius: 24, boxShadow: '0 4px 32px #0001', fontSize: '1.15rem', margin: '0 12px 48px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-900)', marginBottom: 12, fontWeight: 700 }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--secondary-600)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 500 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: 'var(--space-24) 0', backgroundColor: 'var(--secondary-50)' }}>
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

      {/* Interactive Testimonial Feature Section */}
      <section id="reviews" className="container-fluid py-5" style={{ background: '#4ec28a', borderRadius: 24, margin: '48px 0' }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2" style={{ fontSize: '2.5rem', color: 'white' }}>What Our Users Say</h2>
          <p className="mb-0" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.95)' }}>
            Join thousands of satisfied users who have transformed their health with Medimeal
          </p>
        </div>
        <div className="row justify-content-center" style={{ minHeight: 420 }}>
          {testimonials.map((t, idx) => (
            <div key={idx} className="col-md-4 d-flex justify-content-center align-items-center mb-4 mb-md-0">
              <div className="card shadow-lg p-4" style={{ borderRadius: 32, minHeight: 480, maxWidth: 400, width: '100%', background: 'rgba(255,255,255,0.97)' }}>
                <div className="d-flex justify-content-center mb-4">
                  <img
                    src={idx === 0 ? 'https://randomuser.me/api/portraits/women/65.jpg' : idx === 1 ? 'https://randomuser.me/api/portraits/men/44.jpg' : 'https://randomuser.me/api/portraits/women/44.jpg'}
                    alt={t.name}
                    style={{
                      width: 180,
                      height: 180,
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '8px solid #fff',
                      boxShadow: '0 4px 32px #0003',
                      background: '#fff',
                    }}
                  />
                </div>
                <h2 className="fw-bold text-center mb-3" style={{ fontSize: '1.5rem', color: '#222' }}>What Our Users Say</h2>
                <p className="text-center text-muted mb-3" style={{ fontSize: '1.1rem' }}>Join thousands of satisfied users who have transformed their health with Medimeal</p>
                <div className="mb-4" style={{ fontSize: '1.15rem', fontWeight: 500, color: '#222', lineHeight: 1.5, textAlign: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, display: 'block', marginBottom: 12 }}>
                    “{t.content}”
                  </span>
                  <div className="mb-2" style={{ textAlign: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: '#FFD600', fontSize: 28, marginRight: 2 }}>★</span>
                    ))}
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center mt-2">
                  <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-3" style={{ width: 56, height: 56, fontWeight: 700, fontSize: 24, boxShadow: '0 2px 12px #0002' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '1.1rem', color: '#0d6efd' }}>{t.name}</div>
                    <div className="text-muted" style={{ fontSize: '1rem' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <style>{`
      .testimonial-fade {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1);
      }
      .testimonial-fade.in {
        opacity: 1;
        transform: translateY(0);
      }
      `}</style>

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
            Join thousands of users who have improved their health with personalized meal recommendations. Start your journey to better health today!
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

      {/* Food Variety Section (like screenshot) */}
      <section className="container py-5" style={{ marginTop: 48, marginBottom: 48 }}>
        <div className="row align-items-center justify-content-center">
          {/* Left: Single Fruit Bowl Image */}
          <div className="col-md-6 d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80"
              alt="Salad"
              style={{
                width: 400,
                height: 400,
                objectFit: 'cover',
                borderRadius: 32,
                boxShadow: '0 4px 24px #0001',
                background: '#fff',
              }}
            />
          </div>
          {/* Right: Heading and Description */}
          <div className="col-md-6 ps-md-5 mt-5 mt-md-0">
            <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem', color: '#29536b', lineHeight: 1.1 }}>A Variety of Tasty Nutritious Choices</h2>
            <p className="mb-0" style={{ fontSize: '1.25rem', color: '#444', fontWeight: 500 }}>
              MediMeal weight loss drinks, snacks, shakes, and meal replacements<br />
              are packed with ingredients that will help support your appetite and taste great.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-dark text-white pt-5 pb-3 mt-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="h4 fw-bold mb-2">Medimeal</div>
              <p className="text-white-50 mb-2">Transforming health through AI-powered personalized nutrition. Your journey to better health starts here.</p>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold mb-2">Product</h6>
              <ul className="list-unstyled">
                <li><a href="#features" className="text-white-50 text-decoration-none">Features</a></li>
                <li><a href="#" className="text-white-50 text-decoration-none">Pricing</a></li>
                <li><a href="#" className="text-white-50 text-decoration-none">API</a></li>
              </ul>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold mb-2">Support</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white-50 text-decoration-none">Help Center</a></li>
                <li><a href="#" className="text-white-50 text-decoration-none">Contact Us</a></li>
                <li><a href="#" className="text-white-50 text-decoration-none">Community</a></li>
              </ul>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold mb-2">Legal</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white-50 text-decoration-none">Privacy Policy</a></li>
                <li><a href="#" className="text-white-50 text-decoration-none">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-white-50 border-top pt-3">
            &copy; 2024 Medimeal. All rights reserved.
          </div>
        </div>
      </footer>
      {/* Add bubble animation styles */}
      <style>{`
        .testimonial-fade {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1);
        }
        .testimonial-fade.in {
          opacity: 1;
          transform: translateY(0);
        }
        .bubble {
          position: absolute;
          background: radial-gradient(circle at 60% 40%, #6ec1e4 70%, #2986cc 100%);
          opacity: 0.22;
          border-radius: 50%;
          z-index: 1;
          animation: bubbleFloat 8s ease-in-out infinite;
        }
        .bubble:nth-child(1) { animation-delay: 0s; }
        .bubble:nth-child(2) { animation-delay: 2s; }
        .bubble:nth-child(3) { animation-delay: 4s; }
        .bubble:nth-child(4) { animation-delay: 6s; }
        .bubble:nth-child(5) { animation-delay: 1.5s; }
        .bubble:nth-child(6) { animation-delay: 3.5s; }
        .bubble:nth-child(7) { animation-delay: 5.5s; }
        @keyframes bubbleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.22; }
          50% { transform: translateY(-40px) scale(1.08); opacity: 0.32; }
          100% { transform: translateY(0) scale(1); opacity: 0.22; }
        }
      `}</style>
    </div>
  );
};

export default Landing;


