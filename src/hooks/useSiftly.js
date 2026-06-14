import { useState, useEffect, useRef } from "react";

// ── Hook: track whether user has scrolled past 20px ──────────────────────────
// Used for navbar background change on scroll
export function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Update state whenever user scrolls
    const fn = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", fn);

    // Cleanup — remove listener when component unmounts
    return () => window.removeEventListener("scroll", fn);
  }, []); // Empty deps — only run once on mount

  return scrolled;
}

// ── Hook: animate elements into view as they enter the viewport ───────────────
// Elements with className "sl-reveal" get "visible" class added when scrolled to
export function useReveal() {
  useEffect(() => {
    // Select all elements that should animate in on scroll
    const els = document.querySelectorAll(".sl-reveal");

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible"); // Trigger CSS animation
          obs.unobserve(e.target);           // Stop watching — animate only once
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of element is visible

    els.forEach(el => obs.observe(el));

    // Cleanup — disconnect observer when component unmounts
    return () => obs.disconnect();
  }, []); // Empty deps — only run once on mount
}

// ── Hook: custom cursor with dot + lagging ring effect ───────────────────────
// cursorRef = small dot (follows mouse exactly)
// ringRef   = larger ring (follows with smooth lag via lerp)
export function useCursor() {
  const cursorRef = useRef(null); // Small dot element
  const ringRef   = useRef(null); // Outer ring element

  useEffect(() => {
    // mx/my = actual mouse position (updated instantly)
    // rx/ry = ring's current position (lerps toward mx/my)
    let rx = 0, ry = 0, mx = 0, my = 0;

    // Track real mouse position and move dot instantly
    const onMove = e => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + "px";
        cursorRef.current.style.top  = my + "px";
      }
    };

    // Animation loop — ring smoothly lerps toward mouse (0.12 = lerp speed)
    // Higher value = faster/less lag, lower = slower/more lag
    const anim = () => {
      rx += (mx - rx) * 0.12; // Linear interpolation toward target X
      ry += (my - ry) * 0.12; // Linear interpolation toward target Y

      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top  = ry + "px";
      }

      requestAnimationFrame(anim); // Keep looping every frame (~60fps)
    };

    document.addEventListener("mousemove", onMove);
    anim(); // Start the animation loop

    // Scale up cursor when hovering links or buttons
    const links = document.querySelectorAll(".sl-page a,.sl-page button");

    const enter = () => {
      // Dot scales to 2x on hover
      cursorRef.current && (cursorRef.current.style.transform = "translate(-50%,-50%) scale(2)");
      // Ring scales to 1.5x on hover
      ringRef.current   && (ringRef.current.style.transform   = "translate(-50%,-50%) scale(1.5)");
    };

    const leave = () => {
      // Reset both back to normal size
      cursorRef.current && (cursorRef.current.style.transform = "translate(-50%,-50%) scale(1)");
      ringRef.current   && (ringRef.current.style.transform   = "translate(-50%,-50%) scale(1)");
    };

    // Attach hover listeners to all interactive elements
    links.forEach(l => {
      l.addEventListener("mouseenter", enter);
      l.addEventListener("mouseleave", leave);
    });

    // Cleanup — remove mousemove listener on unmount
    // Note: rAF loop and hover listeners are not explicitly cancelled
    return () => { document.removeEventListener("mousemove", onMove); };
  }, []); // Empty deps — only run once on mount

  // Return refs so parent component can attach them to DOM elements
  return { cursorRef, ringRef };
}