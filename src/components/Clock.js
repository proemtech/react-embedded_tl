import React, { useEffect, useState } from "react";

export default function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [currentTime]);

  return (
    <>
      <p className="currentTime">{currentTime.toLocaleTimeString()}</p>
    </>
  );
}
