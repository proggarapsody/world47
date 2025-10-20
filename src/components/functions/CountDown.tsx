import React, { useState, useEffect } from "react";

interface CountDownProps {
  h: number;
  m: number;
  s: number;
}

const CountDown: React.FC<CountDownProps> = ({ h, m, s }) => {
  const [hours, setHour] = useState<number>(h);
  const [minutes, setMinutes] = useState<number>(m);
  const [seconds, setSeconds] = useState<number>(s);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          setMinutes(prevMinutes => {
            if (prevMinutes > 0) {
              return prevMinutes - 1;
            } else {
              setHour(prevHours => {
                if (prevHours > 0) {
                  return prevHours - 1;
                }
                return prevHours;
              });
              return 59;
            }
          });
          return 59;
        }
      });
    }, 1000);

    if (hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [hours, minutes, seconds]);

  return (
    <h6 className="text-white">
      {hours < 10 ? "0" + hours : hours}h :{" "}
      {minutes < 10 ? "0" + minutes : minutes}m :{" "}
      {seconds < 10 ? "0" + seconds : seconds}s
    </h6>
  );
};

export default CountDown;
