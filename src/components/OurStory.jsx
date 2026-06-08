import React from "react";
import { Link } from "react-router-dom";
import "./OurStory.css";

const OurStory = () => {
  return (
    <section className="our-story-section">
      <div className="story-container">
        <div className="story-header" data-aos="fade-down">
          <h1 className="story-title">Our Story</h1>
          <p className="story-subtitle">From Chemical Engineer to Health Movement</p>
        </div>

        {/* Founder Section */}
        <div className="story-founder" data-aos="fade-right">
          <div className="founder-quote">
            <p className="quote-text">"The best engineering protects people first."</p>
          </div>
          <div className="founder-bio">
            <h2>Sanyam Singh</h2>
            <p className="founder-title">Chemical Process Engineer. Problem-Solver. Health Advocate.</p>
            <p>
              My journey began at Thapar Institute of Engineering and Technology, where I earned my degree 
              in Chemical Engineering. Eager to bridge technical depth with strategic thinking, I later 
              completed an Executive Management Program at the Indian Institute of Management Kashipur. 
              Engineering taught me how systems work. Management taught me how decisions scale.
            </p>
          </div>
        </div>

        {/* The Lesson */}
        <div className="story-content-block" data-aos="fade-left">
          <h2 className="block-title">📖 The Lesson from a Jaggery Cube</h2>
          <p>
            Early in my career, I worked in a chemical manufacturing plant, surrounded by hazardous 
            compounds every day. Along with our safety gear, we were given jaggery cubes. The company 
            strongly recommended jaggery powder in our daily diet.
          </p>
          <p>
            The reason was simple and passed down by generations: jaggery is traditionally believed to 
            help cleanse the lungs and support respiratory health for those exposed to pollutants and chemicals.
          </p>
          <div className="pull-quote">
            <p>"That small cube taught me what no textbook did — the best engineering protects people first. Great processes consider not just output, but the health of the hands running them."</p>
          </div>
        </div>

        {/* From Tradition to Research */}
        <div className="story-content-block" data-aos="fade-right">
          <h2 className="block-title">🔬 From Tradition to Research</h2>
          <p>
            That experience sparked a question: <em>why jaggery?</em> I turned to research papers and 
            literature on its health benefits. The science was compelling — potential to detoxify the 
            body, purify the blood, and support lung function.
          </p>
          <p>
            But the market told a different story. Most jaggery available was loosely packed, poorly 
            processed, and often adulterated with refined sugar. Reheating sugar with jaggery destroys 
            its natural benefits, leaving a product that's nutritionally inferior and sometimes harmful.
          </p>
          <p>
            There was a clear gap between jaggery's true potential and the quality people actually consumed.
          </p>
        </div>

        {/* A Missed Global Opportunity */}
        <div className="story-content-block" data-aos="fade-left">
          <h2 className="block-title">🌍 A Missed Global Opportunity</h2>
          <p>
            This gap concerned me deeply. India is one of the largest producers and exporters of jaggery 
            in the world. Global demand is rising fast — especially from markets like the United States — 
            as health-conscious consumers seek cleaner alternatives to refined sugar.
          </p>
          <div className="pull-quote">
            <p>"Yet, we have not positioned jaggery as a premium, reliable, and health-focused product. We've treated it as a commodity. The world knows sugar. It's time they know real jaggery."</p>
          </div>
        </div>

        {/* Why This Is Personal */}
        <div className="story-content-block" data-aos="fade-right">
          <h2 className="block-title">💚 Why This Is Personal</h2>
          <p>
            Living in Delhi NCR made the mission urgent. This region battles severe air pollution for 
            months each year. North India faces prolonged exposure to toxic particulates. For generations, 
            our grandmothers handed us jaggery to clear the throat, support the lungs, and build immunity.
          </p>
          <div className="pull-quote">
            <p>"Look at a map: India's major sugarcane and jaggery belts lie right here, in the same region struggling with polluted air. Nature placed the problem and the remedy side by side."</p>
          </div>
          <p>
            That realization became our turning point. We set out to build a mission-driven brand — to 
            revive and modernize jaggery in both block and powder form, with unwavering quality, purity, and trust.
          </p>
        </div>

        {/* Our Mission */}
        <div className="story-mission" data-aos="zoom-in">
          <h2>🎯 Our Mission</h2>
          <p>
            Our goal is simple: Help people shift from refined sugar to a cleaner, more natural alternative 
            that supports long-term health and well-being.
          </p>
          <p>
            Excessive refined sugar consumption is directly linked to lifestyle diseases like diabetes. 
            We believe mindful alternatives can create meaningful change — for individuals, families, and generations.
          </p>
          <p className="mission-statement">
            This is not just a product journey. It is a health movement rooted in science, tradition, and responsibility.
          </p>
          <p className="invitation">
            <strong>And you're invited to be part of it.</strong>
          </p>
          <Link to="/buynow">
            <button className="join-movement-btn">Join the Movement →</button>
          </Link>
        </div>

        {/* Founder Short Bio */}
        <div className="founder-short-bio" data-aos="fade-up">
          <div className="bio-card">
            <p className="bio-text">
              <strong>Sanyam Singh</strong> is a Chemical Process Engineer from Thapar Institute of Engineering 
              and Technology and IIM Kashipur. His journey began in a chemical plant where workers were given 
              jaggery daily to support lung health — a tradition that sparked his mission. Research confirmed 
              jaggery's benefits for detoxification and respiratory support, but the market was filled with 
              adulterated, poorly processed products. With India as a leading jaggery producer and global demand 
              rising, Sanyam saw a gap: we weren't offering jaggery as the premium, trusted health product it 
              should be. Living in Delhi NCR, with its severe air pollution, made this personal. Today, he's 
              building a mission-driven brand to revive jaggery in pure block and powder form. The goal: help 
              people move from refined sugar to a cleaner alternative, and turn ancient wisdom into a modern 
              health movement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;