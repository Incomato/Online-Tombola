import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
}

const calculateTimeLeft = (target: Date) => {
  const difference = +target - +new Date();
  let timeLeft = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const addLeadingZero = (value: number) => value.toString().padStart(2, '0');

  const timerComponents = [
    { label: 'Hours', value: addLeadingZero(timeLeft.hours) },
    { label: 'Minutes', value: addLeadingZero(timeLeft.minutes) },
    { label: 'Seconds', value: addLeadingZero(timeLeft.seconds) },
  ];

  const isTimeUp = !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds;

  return (
    <div className="text-center my-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
      <p className="text-sm font-medium text-slate-400 mb-2">
        {isTimeUp ? 'Drawing will begin shortly!' : 'Drawing in:'}
      </p>
      {!isTimeUp && (
        <div className="flex justify-center space-x-4">
          {timerComponents.map((component) => (
            <div key={component.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white tabular-nums">
                {component.value}
              </span>
              <span className="text-xs text-slate-500 uppercase">
                {component.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Countdown;
