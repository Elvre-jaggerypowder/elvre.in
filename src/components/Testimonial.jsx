import React, { useState, useEffect } from "react";
import "./Testimonial.css";

const Testimonial = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = () => {
    const saved = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    setFeedbacks(saved);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="testimonial-section" id="testimonial">
        <div className="testimonial-container">
          <h2>Loading testimonials...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonial-section" id="testimonial">
      <div className="testimonial-container">
        <div className="testimonial-header">
          <h2>OUR TESTIMONIALS</h2>
          <p>WHAT THEY'RE TALKING ABOUT</p>
        </div>
        
        <div className="testimonial-grid">
          {feedbacks.length === 0 ? (
            <div className="no-feedback">
              <p>No feedback available. Be the first to share your experience!</p>
            </div>
          ) : (
            feedbacks.map((feedback, index) => (
              <div key={index} className="testimonial-card">
                <p className="feedback-message">"{feedback.message}"</p>
                <div className="feedback-author">
                  <strong>{feedback.name || "Anonymous"}</strong>
                  <span>{feedback.email}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;