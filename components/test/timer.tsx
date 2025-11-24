"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  startTime: Date;
  maxHours?: number;
}

export function Timer({ startTime, maxHours = 6 }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const diff = Math.floor((now - start) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const maxSeconds = maxHours * 3600;
  const remaining = maxSeconds - elapsed;
  const isWarning = remaining < 1800; // Less than 30 minutes

  return (
    <div className="flex items-center space-x-2">
      <Clock className={`w-5 h-5 ${isWarning ? "text-red-500" : "text-gray-500"}`} />
      <span className={`font-mono text-lg ${isWarning ? "text-red-500 font-bold" : "text-gray-700"}`}>
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

