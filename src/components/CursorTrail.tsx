'use client';

import { useEffect } from 'react';

export function CursorTrail() {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.top = `${e.clientY}px`;
      cursor.style.left = `${e.clientX}px`;

      const paneContainer = document.querySelector(".pane-container");
      const dialogContainer = document.querySelector('[role="dialog"]');

      const shouldHide =
        (paneContainer && paneContainer.contains(e.target as Node)) ||
        (dialogContainer && dialogContainer.contains(e.target as Node));

      cursor.style.opacity = shouldHide ? "0" : "1";
      cursor.textContent = "";

      if (!shouldHide) {
        createHeartTrail(e.clientX, e.clientY);
        cursor.textContent = "💌";
      }
    };

    const createHeartTrail = (x: number, y: number) => {
      const heart = document.createElement("div");
      heart.classList.add("heart-trail");
      heart.style.top = `${y}px`;
      heart.style.left = `${x}px`;
      heart.style.backgroundColor = getRandomColor();
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1200);
    };

    const getRandomColor = () => {
      const colors = ["#ff6b6b", "#ff3b3b", "#ff9999", "#ff1e56"];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cursor.remove();
    };
  }, []);

  return null;
}
