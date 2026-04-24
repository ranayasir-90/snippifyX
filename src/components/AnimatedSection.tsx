"use client";

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'scale-in';
  delay?: number;
  threshold?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animationType = 'fade-in',
  delay = 0,
  threshold = 0.1,
}) => {
  const { ref, isVisible } = useScrollAnimation(threshold);

  const getAnimationClass = () => {
    const baseClass = `scroll-${animationType}`;
    return isVisible ? `${baseClass} visible` : baseClass;
  };

  return (
    <section
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </section>
  );
}; 