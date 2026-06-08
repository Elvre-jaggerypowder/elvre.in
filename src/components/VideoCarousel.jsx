import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./VideoCarousel.css";

const VideoCarousel = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef({});
  const swiperRef = useRef(null);

  const videos = [
    {
      id: 1,
      src: "/videos/WhatsApp%20Video%202026-05-13%20at%201.31.18%20AM.mp4",
      title: "Traditional Jaggery Making",
      description: "Witness the age-old craft of pure jaggery preparation.",
    },
    {
      id: 2,
      src: "/videos/WhatsApp%20Video%202026-05-13%20at%201.31.46%20AM.mp4",
      title: "100% Chemical Free",
      description: "No preservatives, just pure sugarcane goodness.",
    },
    {
      id: 3,
      src: "/videos/WhatsApp%20Video%202026-05-13%20at%201.34.12%20AM.mp4",
      title: "Farmer First Initiative",
      description: "Supporting local farming communities.",
    },
    {
      id: 4,
      src: "/videos/WhatsApp%20Video%202026-05-13%20at%201.36.30%20AM.mp4",
      title: "Premium Quality Promise",
      description: "Experience the ELVRE difference today.",
    }
  ];

  // Handle video playback when slide changes
  const handleSlideChange = (swiper) => {
    const newIndex = swiper.realIndex;
    
    // Pause all videos
    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[key];
      if (video) {
        video.pause();
      }
    });
    
    // Play the active video
    const activeVideo = videoRefs.current[newIndex];
    if (activeVideo) {
      activeVideo.play().catch(e => console.log("Play error:", e));
    }
    
    setActiveIndex(newIndex);
  };

  // Toggle mute/unmute for all videos
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[key];
      if (video) {
        video.muted = newMutedState;
      }
    });
  };

  return (
    <section className="video-carousel-section">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        className="video-swiper"
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video.id}>
            <div className="video-slide">
              <video
                ref={(el) => {
                  if (el) videoRefs.current[index] = el;
                }}
                className="fullscreen-video"
                muted={isMuted}
                loop
                playsInline
                preload="auto"
              >
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay">
                <div className="video-content">
                  <h2>{video.title}</h2>
                  <p>{video.description}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Sound Control Button */}
      <button className="sound-control-btn" onClick={toggleMute}>
        {isMuted ? '🔇' : '🔊'}
      </button>
    </section>
  );
};

export default VideoCarousel;