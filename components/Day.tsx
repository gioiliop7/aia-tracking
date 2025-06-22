"use client";

import { useEffect, useState } from "react";

export default function LiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const time = currentTime.toLocaleTimeString("el-GR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const date = currentTime.toLocaleDateString("el-GR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "long",
  });

  return (
    <div className="text-right">
      <div className="text-xl font-bold">{time}</div>
      <div className="text-sm">{date}</div>
    </div>
  );
}
