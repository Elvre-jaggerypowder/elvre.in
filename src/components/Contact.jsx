import React, { useState } from "react";
import "./Contact.css";
import { supabase } from "../supabaseClient";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const { error } = await supabase
        .from("Feedbacks")
        .insert([
          {
            name: formData.name,
            label: formData.label,
            message: formData.message,
          },
        ]);

      if (error) {
        console.error("Supabase insert error:", error);
        setStatus("❌ Something went wrong. Please try again.");
      } else {
        setStatus("✅ Feedback Sent!");
        setFormData({ name: "", label: "", message: "" });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-left" data-aos="fade-right">
          <h3>CONTACT NOW</h3>
          <h1>GET IN TOUCH NOW</h1>
          <p>
            PHONE
            <strong>
              <br />+91 7060998050
              <br />
            </strong>
            <strong>+91 7906396629</strong>
          </p>
          <p>
            EMAIL
            <strong>
              <br />elvreofficals@gmail.com
            </strong>
          </p>
          <p>
            ADDRESS
            <strong>
              <br />
              1st Floor, Sangam Tent House, Jawalapur, Haridwar, Uttrakhand,
              249407
            </strong>
          </p>
        </div>

        <form className="contact-right" onSubmit={handleSubmit} data-aos="fade-left" data-aos-delay="200">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="label"
            placeholder="Your Label"
            value={formData.label}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">SEND FEEDBACK</button>
          {status && <p className="status-message">{status}</p>}
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
