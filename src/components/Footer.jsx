import React, { useRef, useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./Footer.css";

const Footer = () => {
  const form = useRef();
  const [status, setStatus] = useState("");
  const [contactInfo, setContactInfo] = useState({
    phone1: "+91 7060998050",
    phone2: "+91 8755499816",
    email: "elvreofficals@gmail.com",
    address: "1st Floor, Sangam Tent House, Jawalapur, Haridwar, Uttrakhand, 249407"
  });

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = () => {
    const saved = localStorage.getItem("contactInfo");
    if (saved) {
      try {
        setContactInfo(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading contact info:', e);
      }
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_suvhk3j",
        "template_2bpgw82",
        form.current,
        "zPChkrLTWlnnSFFtp"
      )
      .then(
        () => {
          setStatus("✅ Thank you! Your message has been sent.");
          form.current.reset();
          setTimeout(() => setStatus(""), 5000);
        },
        (error) => {
          console.log(error.text);
          setStatus("❌ Something went wrong. Please try again.");
          setTimeout(() => setStatus(""), 5000);
        }
      );
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">

          {/* ===== COLUMN 1: BRAND ===== */}
          <div className="footer-col footer-brand">
            <img
              src={`${process.env.PUBLIC_URL}/assets/ELVRElogo1.png`}
              alt="ELVRE Logo"
              className="footer-logo"
            />
            <p className="footer-tagline">Pure & Natural Jaggery</p>
            <div className="footer-social">
              <a href="https://wa.me/917906396629" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
              <a href="https://www.facebook.com/profile.php?id=61579641740801" target="_blank" rel="noreferrer"><FaFacebookF /></a>
              <a href="https://www.instagram.com/elvre_officals_/" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="https://www.linkedin.com/company/elvre-enterprised-private-limited/" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
            </div>
            <div className="footer-policies">
              <RouterLink to="/terms">Terms & Conditions</RouterLink>
              <RouterLink to="/privacy">Privacy Policy</RouterLink>
            </div>
            <p className="footer-copyright">© Elvre Enterprises Pvt. Ltd. All Rights Reserved.</p>
          </div>

          {/* ===== COLUMN 2: QUICK LINKS ===== */}
          <div className="footer-col footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><RouterLink to="/">Home</RouterLink></li>
              <li><RouterLink to="/our-story">About Us</RouterLink></li>
              <li><RouterLink to="/products">Products</RouterLink></li>
              <li><RouterLink to="/blog">Blog</RouterLink></li>
              <li><RouterLink to="/terms">Terms & Conditions</RouterLink></li>
              <li><RouterLink to="/privacy">Privacy Policy</RouterLink></li>
            </ul>
          </div>

          {/* ===== COLUMN 3: CONTACT ===== */}
          <div className="footer-col footer-contact">
            <h3>Get in Touch</h3>
            <div className="footer-contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <p>{contactInfo.phone1}</p>
                <p>{contactInfo.phone2}</p>
              </div>
            </div>
            <div className="footer-contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <p>{contactInfo.email}</p>
              </div>
            </div>
            <div className="footer-contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <p>{contactInfo.address}</p>
              </div>
            </div>
          </div>

          {/* ===== COLUMN 4: NEWSLETTER ===== */}
          <div className="footer-col footer-newsletter">
            <h3>Contact us via Email</h3>
            <p>Have a question or inquiry? Send us a message below.</p>
            <form ref={form} onSubmit={sendEmail}>
              <input type="email" name="email" placeholder="Your Email" required />
              <textarea name="message" placeholder="Your message..." required rows="2"></textarea>
              <button type="submit">Send Message</button>
            </form>
            {status && <p className="form-status">{status}</p>}
          </div>

        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <span>🌿 Made with ❤️ in India</span>
          <div className="footer-badges">
            <span className="badge">✨ 100% Natural</span>
            <span className="badge">🌱 Organic</span>
            <span className="badge">🏆 Trusted Brand</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;