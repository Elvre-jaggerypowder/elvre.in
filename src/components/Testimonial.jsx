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

    // ✅ Real‑time subscription – table name is 'Feedbacks' (capital F)
    const subscription = supabase
      .channel('feedbacks-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'Feedbacks' }, 
        (payload) => {
          console.log('📢 New feedback added:', payload.new);
          setFeedbacks(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Auto‑slide effect
  useEffect(() => {
    if (feedbacks.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }, 4500);
    return () => clearInterval(intervalRef.current);
  }, [feedbacks.length]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      // ✅ Fetch from 'Feedbacks' table
      const { data, error } = await supabase
        .from('Feedbacks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Supabase error:', error);
        setFeedbacks([]); // No fake data – empty state
      } else if (data && data.length > 0) {
        setFeedbacks(data);
        // Optional cache – not used as primary source
        localStorage.setItem("feedbacks", JSON.stringify(data));
      } else {
        setFeedbacks([]);
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
              key={feedback.id || index}
              className={`testimonial-slide ${index === currentIndex ? "active" : ""}`}
            >
              <div className="testimonial-card">
                <div className="quote-icon">"</div>
                <p className="testimonial-message">{feedback.message}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {feedback.name ? feedback.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="author-info">
                    <strong>{feedback.name || "Anonymous"}</strong>
                    <span>{feedback.email}</span>
                    <div className="author-rating">
                      {"⭐".repeat(Math.min(feedback.rating || 5, 5))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonial-counter">
          <span>{currentIndex + 1} / {feedbacks.length}</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;