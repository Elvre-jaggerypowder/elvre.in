import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./Testimonial.css";
import { supabase } from "../supabaseClient";

const Testimonial = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data, error } = await supabase
          .from("Feedbacks")
          .select("id, name, message, label, created_at")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setFeedbacks(data || []);
      } catch (error) {
        console.error("Error fetching feedbacks:", error.message);
      }
    };

    fetchFeedbacks();

    const channel = supabase
      .channel("public:Feedbacks")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Feedbacks" },
        (payload) => {
          setFeedbacks((prev) => {
            const updated = [payload.new, ...prev];
            const unique = Array.from(new Map(updated.map((f) => [f.id, f])).values());
            return unique.slice(0, 3);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="testimonial" className="testimonial-container" data-aos="fade-up">
      <h2 className="testimonial-subheading">Our Testimonials</h2>
      <h2 className="testimonial-heading">WHAT THEY'RE TALKING ABOUT</h2>

      {feedbacks.length === 0 ? (
        <p className="no-feedback-message">No feedback available.</p>
      ) : (
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={feedbacks.length > 1}
          spaceBetween={30}
          slidesPerView={1}
        >
          {feedbacks.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="testimonial-card" data-aos="zoom-in" data-aos-delay="100">
                <p className="testimonial-message">"{item.message}"</p>
                <p className="testimonial-name">- {item.name}</p>
                {item.label && (
                  <p className="testimonial-label">{item.label}</p>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default Testimonial;