// src/components/home/AnimatedBanner.jsx
// JAVASCRIPT ANIMATIONS - Full control, buttery smooth

import React, { useState, useEffect, useRef } from 'react';
import './AnimatedBanner.css';

const MESSAGES = [
  "IT'S ALL ABOUT EXPERIENCES",
  "WELCOME TO MY WORLD",
  "EXPLORE MY WORK",
  "LET'S CREATE TOGETHER"
];

// Easing function - Power2.easeOut
const easeOutQuad = (t) => t * (2 - t);

const AnimatedBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(MESSAGES[0]);
  const [showDots, setShowDots] = useState(false);
  
  const bannerRef = useRef(null);
  const textRef = useRef(null);
  const dotsRef = useRef(null);
  const animationRef = useRef(null);
  const widthAnimationRef = useRef(null);

  // Animate width smoothly
  const animateWidth = (fromWidth, toWidth, duration) => {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      
      const currentWidth = fromWidth + (toWidth - fromWidth) * easedProgress;
      
      if (bannerRef.current) {
        bannerRef.current.style.width = `${currentWidth}px`;
      }
      
      if (progress < 1) {
        widthAnimationRef.current = requestAnimationFrame(animate);
      }
    };
    
    widthAnimationRef.current = requestAnimationFrame(animate);
  };

  // Animate opacity smoothly
  const animateOpacity = (element, fromOpacity, toOpacity, duration, callback) => {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      
      const currentOpacity = fromOpacity + (toOpacity - fromOpacity) * easedProgress;
      
      if (element) {
        element.style.opacity = currentOpacity;
      }
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (callback) {
        callback();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Animate transform smoothly
  const animateTransform = (element, fromY, toY, duration) => {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      
      const currentY = fromY + (toY - fromY) * easedProgress;
      
      if (element) {
        element.style.transform = `translateY(${currentY}px)`;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Measure text width
  const measureTextWidth = (text) => {
    if (!bannerRef.current) return 200;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '700 20px "DM Sans"';
    const metrics = context.measureText(text);
    
    // Add padding and avatar space
    return metrics.width + 160; // text width + padding + gap + avatar
  };

  // Main animation cycle
  useEffect(() => {
    const cycle = setInterval(() => {
      const currentWidth = bannerRef.current?.offsetWidth || 200;
      const dotsWidth = 56 + 160; // dots width + padding + gap + avatar
      
      // Phase 1: Fade out text (600ms)
      animateOpacity(textRef.current, 1, 0, 600, () => {
        // Phase 2: Show dots and animate width (500ms)
        setShowDots(true);
        animateTransform(textRef.current, 0, -8, 300);
        
        if (dotsRef.current) {
          dotsRef.current.style.display = 'flex';
          animateOpacity(dotsRef.current, 0, 1, 300);
        }
        
        // Animate width to dots size
        animateWidth(currentWidth, dotsWidth, 800);
        
        // Phase 3: Change text and measure new width (1100ms)
        setTimeout(() => {
          const nextIndex = (currentIndex + 1) % MESSAGES.length;
          const nextText = MESSAGES[nextIndex];
          setCurrentIndex(nextIndex);
          setDisplayText(nextText);
          
          // Hide dots
          animateOpacity(dotsRef.current, 1, 0, 300, () => {
            setShowDots(false);
            if (dotsRef.current) {
              dotsRef.current.style.display = 'none';
            }
          });
          
          // Measure and animate to new width
          const newWidth = measureTextWidth(nextText);
          animateWidth(dotsWidth, newWidth, 900);
          
          // Fade in new text
          setTimeout(() => {
            animateTransform(textRef.current, 10, 0, 500);
            animateOpacity(textRef.current, 0, 1, 600);
          }, 50);
        }, 1100);
      });
    }, 4500);

    return () => {
      clearInterval(cycle);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (widthAnimationRef.current) {
        cancelAnimationFrame(widthAnimationRef.current);
      }
    };
  }, [currentIndex]);

  return (
    <div className="animated-banner-wrapper">
      <div className="animated-banner js-animated" ref={bannerRef}>
        <div className="banner-text-container">
          {/* Text */}
          <div 
            ref={textRef}
            className="banner-text"
            style={{ opacity: 1, transform: 'translateY(0)' }}
          >
            {displayText}
          </div>
          
          {/* Loading Dots */}
          <div 
            ref={dotsRef}
            className="loading-dots"
            style={{ display: 'none', opacity: 0 }}
          >
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>

        <div className="banner-avatar">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop" 
            alt="Profile"
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedBanner;