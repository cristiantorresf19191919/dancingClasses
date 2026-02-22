"use client";

import React, { useEffect, useState } from "react";

type TypingEffectProps = {
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
};

export default function TypingEffect({
  text,
  speed = 40,
  className = "",
  cursor = true,
}: TypingEffectProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {cursor && (
        <span
          className={`inline-block w-0.5 h-[1em] align-middle bg-neon-pink ml-0.5 ${
            done ? "opacity-0" : "animate-typing-cursor"
          }`}
          aria-hidden
        />
      )}
    </span>
  );
}
