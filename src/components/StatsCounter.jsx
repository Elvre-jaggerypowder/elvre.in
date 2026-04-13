import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import "./StatsCounter.css";

const StatsCounter = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const stats = [
    { value: 100, suffix: "%", label: "Natural & Chemical Free" },
    { value: 5000, suffix: "+", label: "Happy Customers" },
    { value: 100, suffix: "%", label: "Farmer Made" },
    { value: 24, suffix: "/7", label: "Customer Support" },
  ];

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="stat-number">
              {inView ? (
                <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
              ) : (
                `0${stat.suffix}`
              )}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;