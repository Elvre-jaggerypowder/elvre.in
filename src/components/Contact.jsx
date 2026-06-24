import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ Contact Info State
  const [contactInfo, setContactInfo] = useState({
    phone1: "+91 7060998050",
    phone2: "+91 7906396629",
    email: "elvreofficals@gmail.com",
    address: "1st Floor, Sangam Tent House, Jawalapur, Haridwar, Uttrakhand, 249407"
  });

  useEffect(() => {
    loadFeedbacks();
    loadContactInfo();
  }, []);

  // ✅ Load Contact Info from localStorage
  const loadContactInfo = () => {
    const saved = localStorage.getItem("contactInfo");
    if (saved) {
      setContactInfo(JSON.parse(saved));
      console.log('Contact info loaded:', JSON.parse(saved));
    }
  };

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Supabase error:', error);
        const saved = JSON.parse(localStorage.getItem("feedbacks") || "[]");
        setFeedbacks(saved);
      } else if (data && data.length > 0) {
        setFeedbacks(data);
        localStorage.setItem("feedbacks", JSON.stringify(data));
      } else {
        const saved = JSON.parse(localStorage.getItem("feedbacks") || "[]");
        setFeedbacks(saved);
      }
    } catch (err) {
      console.error('Error:', err);
      const saved = JSON.parse(localStorage.getItem("feedbacks") || "[]");
      setFeedbacks(saved);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("❌ Please fill all fields");
      setTimeout(() => setStatus(""), 3000);
      return;
    }

    const newFeedback = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      message: formData.message,
      date: new Date().toLocaleDateString(),
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert([newFeedback]);
      
      if (error) {
        console.error('Supabase error:', error);
        const saved = JSON.parse(localStorage.getItem("feedbacks") || "[]");
        saved.unshift(newFeedback);
        localStorage.setItem("feedbacks", JSON.stringify(saved));
        setFeedbacks(saved);
      } else {
        console.log('Feedback saved to Supabase!');
        const saved = JSON.parse(localStorage.getItem("feedbacks") || "[]");
        saved.unshift(newFeedback);
        localStorage.setItem("feedbacks", JSON.stringify(saved));
        setFeedbacks([newFeedback, ...feedbacks]);
      }
      
      setFormData({ name: "", email: "", message: "" });
      setStatus("✅ Thank you! Your feedback has been submitted.");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error('Error:', err);
      setStatus("❌ Something went wrong. Please try again.");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h2>Contact Us</h2>
          <p>GET IN TOUCH</p>
        </div>

        <div className="contact-grid">
          {/* LEFT - Contact Info */}
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p className="contact-info-sub">We'd love to hear from you</p>
            
            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="contact-info-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p className="contact-phone">{contactInfo.phone1}</p>
                  <p className="contact-phone">{contactInfo.phone2}</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p className="contact-email">{contactInfo.email}</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">📍</div>
                <div>
                  <h4>Address</h4>
                  <p className="contact-address">{contactInfo.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Feedback Form */}
          <div className="contact-form">
            <h3>Send us your feedback</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <textarea
                name="message"
                placeholder="Your message..."
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <button type="submit">Send Feedback</button>
            </form>
            {status && <p className="form-status">{status}</p>}
          </div>
        </div>

        {/* Recent Feedbacks */}
        {feedbacks.length > 0 && (
          <div className="recent-feedbacks">
            <h3>Recent Feedback</h3>
            <div className="feedback-list">
              {feedbacks.slice(0, 2).map((fb) => (
                <div key={fb.id} className="feedback-item">
                  <div className="feedback-item-header">
                    <strong>{fb.name}</strong>
                    <span>{fb.date || new Date(fb.created_at).toLocaleDateString()}</span>
                  </div>
                  <p>{fb.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;