import React, { useState, useEffect } from 'react';
import { Users, ThumbsUp, Clock, Sparkles } from 'lucide-react';

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Founded in September 2022 (September 1, 2022, 00:00:00)
const START_DATE = new Date(2022, 8, 1, 0, 0, 0);

function calculateTimeElapsed(): TimeElapsed {
  const now = new Date();
  let years = now.getFullYear() - START_DATE.getFullYear();
  let months = now.getMonth() - START_DATE.getMonth();
  let days = now.getDate() - START_DATE.getDate();
  let hours = now.getHours() - START_DATE.getHours();
  let minutes = now.getMinutes() - START_DATE.getMinutes();
  let seconds = now.getSeconds() - START_DATE.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days, hours, minutes, seconds };
}

// Custom hook to animate running numbers with ease-out curve
function useRunningCounter(target: number, durationMs = 2200): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / durationMs, 1);

      // Smooth ease-out exponential curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, durationMs]);

  return count;
}

export const HeroLiveStats: React.FC = () => {
  const customersCount = useRunningCounter(300000, 2200);
  const recommendedCount = useRunningCounter(50000, 2000);
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>(calculateTimeElapsed);

  // Live ticking timer running every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        
        {/* Metric 1: 3,00,000+ Satisfied Customers */}
        <div className="relative rounded-2xl bg-black/60 backdrop-blur-md border border-[#A8BFA0]/25 hover:border-[#C5A46D]/60 p-5 sm:p-6 transition-all duration-300 shadow-xl group flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C5A46D] group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Diners
            </div>
          </div>
          <div>
            <div className="font-serif-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white tracking-tight leading-none mb-2">
              {customersCount.toLocaleString('en-IN')}+
            </div>
            <div className="text-xs sm:text-sm font-sans-ui uppercase tracking-wider text-[#DCE8D5]/90 font-medium">
              Satisfied Customers
            </div>
          </div>
        </div>

        {/* Metric 2: 50,000+ Recommended */}
        <div className="relative rounded-2xl bg-black/60 backdrop-blur-md border border-[#A8BFA0]/25 hover:border-[#C5A46D]/60 p-5 sm:p-6 transition-all duration-300 shadow-xl group flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C5A46D] group-hover:scale-105 transition-transform">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A46D]/10 border border-[#C5A46D]/25 text-[#C5A46D] text-[10px] font-mono uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#C5A46D]" />
              Loved
            </div>
          </div>
          <div>
            <div className="font-serif-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white tracking-tight leading-none mb-2">
              {recommendedCount.toLocaleString('en-IN')}+
            </div>
            <div className="text-xs sm:text-sm font-sans-ui uppercase tracking-wider text-[#DCE8D5]/90 font-medium">
              Recommended Diners
            </div>
          </div>
        </div>

        {/* Metric 3: Experience Clock (Live Timer since September 2022) */}
        <div className="relative rounded-2xl bg-black/60 backdrop-blur-md border border-[#A8BFA0]/25 hover:border-[#C5A46D]/60 p-5 sm:p-6 transition-all duration-300 shadow-xl group flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C5A46D] group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A46D]/10 border border-[#C5A46D]/25 text-[#C5A46D] text-[10px] font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D] animate-ping" />
              Live Clock
            </div>
          </div>

          <div>
            {/* 6 Digit Units: Years, Months, Days, Hours, Minutes, Seconds */}
            <div className="grid grid-cols-6 gap-1 sm:gap-1.5 mb-2.5">
              <div className="flex flex-col items-center justify-center py-2 px-0.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="font-mono text-base sm:text-lg font-bold text-[#C5A46D] leading-none">
                  {timeElapsed.years}
                </span>
                <span className="text-[9px] uppercase font-sans-ui tracking-wider text-[#DCE8D5]/70 mt-1">
                  Yrs
                </span>
              </div>

              <div className="flex flex-col items-center justify-center py-2 px-0.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="font-mono text-base sm:text-lg font-bold text-[#C5A46D] leading-none">
                  {timeElapsed.months}
                </span>
                <span className="text-[9px] uppercase font-sans-ui tracking-wider text-[#DCE8D5]/70 mt-1">
                  Mos
                </span>
              </div>

              <div className="flex flex-col items-center justify-center py-2 px-0.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="font-mono text-base sm:text-lg font-bold text-[#C5A46D] leading-none">
                  {timeElapsed.days}
                </span>
                <span className="text-[9px] uppercase font-sans-ui tracking-wider text-[#DCE8D5]/70 mt-1">
                  Days
                </span>
              </div>

              <div className="flex flex-col items-center justify-center py-2 px-0.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="font-mono text-base sm:text-lg font-bold text-white leading-none">
                  {String(timeElapsed.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-sans-ui tracking-wider text-[#DCE8D5]/70 mt-1">
                  Hrs
                </span>
              </div>

              <div className="flex flex-col items-center justify-center py-2 px-0.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="font-mono text-base sm:text-lg font-bold text-white leading-none">
                  {String(timeElapsed.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-sans-ui tracking-wider text-[#DCE8D5]/70 mt-1">
                  Min
                </span>
              </div>

              <div className="flex flex-col items-center justify-center py-2 px-0.5 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/40">
                <span className="font-mono text-base sm:text-lg font-bold text-[#C5A46D] leading-none">
                  {String(timeElapsed.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-sans-ui tracking-wider text-[#C5A46D] mt-1 font-semibold">
                  Sec
                </span>
              </div>
            </div>

            <div className="text-xs sm:text-sm font-sans-ui uppercase tracking-wider text-[#DCE8D5]/90 font-medium">
              Culinary Experience Clock
            </div>
            <div className="text-[11px] font-mono text-[#A8BFA0] mt-0.5">
              Serving live since September 2022
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
