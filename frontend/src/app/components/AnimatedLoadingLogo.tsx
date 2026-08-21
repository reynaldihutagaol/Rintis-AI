"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface AnimatedLoadingLogoProps {
  width?: number;
  height?: number;
}

export default function AnimatedLoadingLogo({ width = 36, height = 36 }: AnimatedLoadingLogoProps) {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev % 8) + 1);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center shrink-0">
      {/* Hidden preloader for all 8 frames */}
      <div className="hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Image key={i} src={`/loading/loading-${i}.png`} alt="" width={width} height={height} />
        ))}
      </div>
      <Image
        src={`/loading/loading-${frame}.png`}
        alt="Menganalisis"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}
