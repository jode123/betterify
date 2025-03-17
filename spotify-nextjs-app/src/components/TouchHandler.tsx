import { useState, useRef } from 'react';

interface TouchHandlerProps {
  onTap: () => void;
  children: React.ReactNode;
  className?: string;
}

export const TouchHandler = ({ onTap, children, className = '' }: TouchHandlerProps) => {
  const touchStartTime = useRef(0);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartTime.current = Date.now();
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    setIsTouching(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndPos = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const touchDuration = Date.now() - touchStartTime.current;
    const touchDistance = Math.hypot(
      touchEndPos.x - touchStartPos.current.x,
      touchEndPos.y - touchStartPos.current.y
    );

    // Only trigger tap if:
    // - Touch duration is less than 300ms
    // - Movement is less than 20px (to differentiate from scrolling)
    if (touchDuration < 300 && touchDistance < 20) {
      onTap();
    }

    setIsTouching(false);
  };

  return (
    <div
      className={`${className} ${isTouching ? 'touching' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};