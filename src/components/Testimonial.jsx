import React, { useState, useEffect, useRef } from "react";
import { supabase } from '../supabaseClient';
import "./Testimonial.css";

const Testimonial = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    loadFeedbacks();

    // ✅ Real-time subscription for new feedbacks
    const subscription = supabase
      .channel('feedbacks-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'feedbacks' }, 
        (payload) => {
          console.log('📢 New feedback added in real-time!', payload.new);
          setFeedbacks(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (feedbacks.length === 0) return;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }, 4500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [feedbacks.length]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Supabase error:', error);
        const saved = JSON.parse(localStorage.getItem("feedbacks") || "[]");
        setFeedbacks(saved);
      } else if (data && data.length > 0) {
        setFeedbacks(data);
        localStorage.setItem("feedbacks", JSON.stringify(data));
      } else {
        // Demo feedbacks
        const demoFeedbacks = [
          {
            id: 1,
            name: "Rahul Sharma",
            email: "rahul@example.com",
            message: "Best jaggery I have ever had. Completely natural and delicious! My whole family loves it.",
            rating: 5,
            date: "2024-06-15"
          },
          {
            id: 2,
            name: "Priya Patel",
            email: "priya@example.com",
            message: "Great product, fast delivery. The quality is amazing and the taste is authentic.",
            rating: 4,
            date: "2024-06-18"
          },
          {
            id: 3,
            name: "Amit Kumar",
            email: "amit@example.com",
            message: "Pure and organic. I highly recommend this to everyone looking for healthy jaggery.",
            rating: 5,
            date: "2024-06-20"
          },
          {
            id: 4,
            name: "Sneha Reddy",
            email: "sneha@example.com",
            message: "The quality is excellent. Used it in my recipes and the taste is amazing.",
            rating: 4,
            date: "2024-06-22"
          },
          {
            id: 5,
            name: "Vikram Singh",
            email: "vikram@example.com",
            message: "Finally found a jaggery that is chemical-free. Thank you ELVRE!",
            rating: 5,
            date: "2024-06-24"
          }
        ];
        setFeedbacks(demoFeedbacks);
        localStorage.setItem("feedbacks", JSON.stringify(demoFeedbacks));
      }
    } catch (err) {
      console.error('Error loading feedbacks:', err);
      setFeedbacks([]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="testimonial-section" id="testimonial">
        <div className="testimonial-container">
          <div className="testimonial-header">
            <h2>OUR TESTIMONIALS</h2>
            <p>WHAT THEY'RE TALKING ABOUT</p>
          </div>
          <div className="loading-spinner">Loading testimonials...</div>
        </div>
      </section>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <section className="testimonial-section" id="testimonial">
        <div className="testimonial-container">
          <div className="testimonial-header">
            <h2>OUR TESTIMONIALS</h2>
            <p>WHAT THEY'RE TALKING ABOUT</p>
          </div>
          <div className="no-feedback">
            <p>No feedback available. Be the first to share your experience!</p>
          </div>
        </div>
      </section>
    );
  }

  const currentFeedback = feedbacks[currentIndex];

  return (
    <section className="testimonial-section" id="testimonial">
      <div className="testimonial-container">
        <div className="testimonial-header">
          <h2>OUR TESTIMONIALS</h2>
          <p>WHAT THEY'RE TALKING ABOUT</p>
        </div>

        <div className="testimonial-slider">
          {feedbacks.map((feedback, index) => (
            <div
              key={feedback.id}
              className={`testimonial-slide ${index === currentIndex ? "active" : ""}`}
            >
              <div className="testimonial-card">
                <div className="quote-icon">"</div>
                <p className="testimonial-message">{feedback.message}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {feedback.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="author-info">
                    <strong>{feedback.name}</strong>
                    <span>{feedback.email}</span>
                    <div className="author-rating">
                      {"⭐".repeat(feedback.rating || 5)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Simple Counter - Removed Dots */}
        <div className="testimonial-counter">
          <span>{currentIndex + 1} / {feedbacks.length}</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;