import React, { useState, useEffect, useRef } from "react";
import "./StatsCounter.css";

const StatsCounter = () => {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);

  const stats = [
    { value: 100, suffix: "%", label: "Natural & Chemical Free" },
    { value: 5000, suffix: "+", label: "Happy Customers" },
    { value: 100, suffix: "%", label: "Farmer Made" },
    { value: 24, suffix: "/7", label: "Customer Support" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
          stats.forEach((stat, index) => {
            let current = 0;
            const target = stat.value;
            const duration = 2000;
            const step = target / (duration / 16);
            
            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                clearInterval(timer);
                current = target;
              }
              setCounts(prev => {
                const newCounts = [...prev];
                newCounts[index] = Math.floor(current);
                return newCounts;
              });
            }, 16);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [started]);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="stat-number">
              {counts[index]}{stat.suffix}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;