'use client'

import React, { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  animation?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right'
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  once?: boolean
}

/**
 * Apple-grade ScrollReveal component using native IntersectionObserver.
 * Smooth fluid animations with cubic-bezier(0.16, 1, 0.3, 1) timing.
 * Automatically respects prefers-reduced-motion for accessibility.
 */
export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.1,
  className = '',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Accessibility check: reduced motion
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        setIsVisible(true)
        return
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(entry.target)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, once])

  const getInitialStyle = () => {
    switch (animation) {
      case 'fade-up':
        return 'opacity-0 translate-y-7'
      case 'fade-in':
        return 'opacity-0'
      case 'scale-up':
        return 'opacity-0 scale-[0.96]'
      case 'slide-left':
        return 'opacity-0 -translate-x-7'
      case 'slide-right':
        return 'opacity-0 translate-x-7'
      default:
        return 'opacity-0 translate-y-7'
    }
  }

  const activeStyle = 'opacity-100 translate-y-0 translate-x-0 scale-100'

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ease-apple will-change-[transform,opacity] ${
        isVisible ? activeStyle : getInitialStyle()
      } ${className}`}
    >
      {children}
    </div>
  )
}
