"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
});

interface Voucher {
  id: number;
  title: string;
  tag: string;
  desc: string;
  claimed: boolean;
}

interface ReasonCard {
  id: number;
  teaser: string;
  content: string;
  revealed: boolean;
}

export default function AkhilaBirthdaySpecial() {
  const [currentStep, setCurrentStep] = useState<
    "intro" | "journey" | "reasons" | "vouchers" | "letter"
  >("intro");
  const [candleBlown, setCandleBlown] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exact Countdown to November 4
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let targetYear = now.getFullYear();
      let targetDate = new Date(targetYear, 10, 4, 0, 0, 0); // Month is 0-indexed: 10 = November

      // If November 4 of this year has already passed, count down to next year's
      if (now.getTime() > targetDate.getTime()) {
        targetDate = new Date(targetYear + 1, 10, 4, 0, 0, 0);
      }

      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const startMusic = async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.volume = 0.65;
      await audioRef.current.play();
      setIsPlayingMusic(true);
    } catch {
      // Browser autoplay policy catch fallback
      setIsPlayingMusic(false);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      startMusic();
    }
  };

  const handleBlowCandle = () => {
    if (candleBlown) return;
    setCandleBlown(true);

    // Auto-start "Ed Sheeran - Perfect" when she taps the candle
    startMusic();

    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.6 },
      colors: ["#f43f5e", "#ec4899", "#fde047", "#ffffff"],
    });
  };

  const [reasons, setReasons] = useState<ReasonCard[]>([
    {
      id: 1,
      teaser: "When you didn’t walk away...",
      content:
        "I opened up about my darkest times and secrets. Anyone else might have left, but you chose to stay, listen, and hold my hand tighter.",
      revealed: false,
    },
    {
      id: 2,
      teaser: "Like rain on parched soil...",
      content:
        "I was trapped in toxic baggage and completely drained. Your entrance into my life was soothing and brought life back into my dead world.",
      revealed: false,
    },
    {
      id: 3,
      teaser: "You make me want to conquer everything...",
      content:
        "Whenever I felt finished and hopeless, your smile gave me fire. I will get stable, reach heights, and make you so proud to be mine.",
      revealed: false,
    },
  ]);

  const toggleReason = (id: number) => {
    setReasons((prev) =>
      prev.map((r) => (r.id === id ? { ...r, revealed: true } : r)),
    );
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ["#fda4af", "#f43f5e", "#fb7185"],
    });
  };

  const [vouchers, setVouchers] = useState<Voucher[]>([
    {
      id: 1,
      title: "Unlimited Warm Hugs & Silence",
      tag: "NO TIME LIMIT",
      desc: "Whenever you feel low or tired, zero words—just warmth until you feel better.",
      claimed: false,
    },
    {
      id: 2,
      title: "Movie Marathon (Your 100% Choice)",
      tag: "ZERO COMPLAINTS",
      desc: "You choose the movie, the snacks, and I will not complain even for 1 second.",
      claimed: false,
    },
    {
      id: 3,
      title: "Favorite Comfort Food Feast",
      tag: "ALL EXPENSES ON ME",
      desc: "Whatever your cravings ask for—street food, dessert, or a dinner date.",
      claimed: false,
    },
    {
      id: 4,
      title: "Win Any Argument Pass",
      tag: "IMMUNITY CARD",
      desc: "Use this whenever I lose my temper or we disagree. You automatically win.",
      claimed: false,
    },
  ]);

  const handleClaimVoucher = (id: number) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, claimed: true } : v)),
    );

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#34d399", "#f472b6", "#fb7185"],
    });
  };

  const triggerGrandFinale = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const interval = setInterval(function () {
      const remainingTime = animationEnd - Date.now();
      if (remainingTime <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 55 * (remainingTime / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * 0.3 + 0.1, y: Math.random() - 0.2 },
        colors: ["#f43f5e", "#fb7185", "#fda4af", "#fcd34d"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * 0.3 + 0.6, y: Math.random() - 0.2 },
        colors: ["#ec4899", "#a855f7", "#fb7185", "#ffffff"],
      });
    }, 250);
  };

  return (
    <main
      className={`${jakarta.className} relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 text-pink-100 select-none overflow-hidden`}
      style={{
        background:
          "radial-gradient(circle at 50% 15%, #2a0b1f 0%, #12040d 45%, #050104 100%)",
      }}
    >
      {/* Background HTML5 Audio playing /EdSheeran-Perfect.mp3 */}
      <audio ref={audioRef} src="/EdSheeran-Perfect.mp3" preload="auto" loop />

      {/* Global CSS to strip scrollbars and style candle flicker */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
        }
        @keyframes candleFlame {
          0%,
          100% {
            transform: scale(1) rotate(-1deg);
            opacity: 0.95;
          }
          25% {
            transform: scale(1.12) rotate(2deg);
            opacity: 1;
            filter: drop-shadow(0 0 16px #fbbf24);
          }
          50% {
            transform: scale(0.9) rotate(-2deg);
            opacity: 0.85;
          }
          75% {
            transform: scale(1.08) rotate(1deg);
            opacity: 1;
            filter: drop-shadow(0 0 22px #f59e0b);
          }
        }
        .flame-anim {
          animation: candleFlame 1.2s infinite ease-in-out;
          transform-origin: bottom center;
        }
        @keyframes floatPetal {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          80% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(105vh) rotate(360deg);
            opacity: 0;
          }
        }
        .petal {
          position: absolute;
          background: radial-gradient(
            circle,
            #f43f5e 20%,
            rgba(244, 63, 94, 0) 80%
          );
          border-radius: 50% 0 50% 50%;
          pointer-events: none;
          animation: floatPetal 11s linear infinite;
        }
      `}</style>

      {/* Ambient Floating Rose Petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="petal w-4 h-4 left-[10%]"
          style={{ animationDuration: "9s", animationDelay: "0s" }}
        />
        <div
          className="petal w-5 h-5 left-[25%]"
          style={{ animationDuration: "13s", animationDelay: "2s" }}
        />
        <div
          className="petal w-3 h-3 left-[50%]"
          style={{ animationDuration: "8s", animationDelay: "4s" }}
        />
        <div
          className="petal w-6 h-6 left-[75%]"
          style={{ animationDuration: "14s", animationDelay: "1s" }}
        />
        <div
          className="petal w-4 h-4 left-[88%]"
          style={{ animationDuration: "10s", animationDelay: "3s" }}
        />
      </div>

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 inset-x-0 max-w-xl mx-auto px-5 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-pink-500/20 backdrop-blur-md text-[11px] text-pink-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Made for Akhila</span>
        </div>

        {/* Music Player Button */}
        <button
          onClick={toggleMusic}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-[11px] font-medium transition-all active:scale-95 ${
            isPlayingMusic
              ? "bg-rose-500/20 border-rose-400/50 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.35)]"
              : "bg-white/5 border-pink-500/20 text-pink-300 hover:bg-pink-500/10"
          }`}
        >
          {isPlayingMusic ? (
            <>
              <span className="flex items-center gap-0.5">
                <span
                  className="w-1 h-3 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1 h-4 bg-pink-300 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </span>
              <span>Perfect 🎵</span>
            </>
          ) : (
            <>
              <span>🎵</span>
              <span>Play Song</span>
            </>
          )}
        </button>
      </div>

      {/* Central Glass Card */}
      <div className="w-full max-w-xl rounded-3xl p-5 sm:p-8 relative z-10 overflow-hidden bg-white/[0.035] backdrop-blur-2xl border border-pink-400/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] transition-all duration-300">
        {/* SCREEN 1: THE BELATED BIRTHDAY & CANDLE */}
        {currentStep === "intro" && (
          <div className="flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <span className="text-[11px] uppercase tracking-widest px-3.5 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 font-medium">
              May 30 • To My Favorite Person
            </span>

            <h1
              className={`${playfair.className} text-3xl sm:text-4xl font-normal leading-snug text-white`}
            >
              Happy Belated Birthday,
              <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200">
                Na Bangaram Akhila
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-pink-100/75 max-w-md font-light leading-relaxed">
              You were thousands of miles away in the US on May 30th. When you
              returned home, I couldn’t do anything for you. But love doesn’t
              forget—today this room, this cake, and this entire day belongs to
              you.
            </p>

            {/* Candle Component */}
            <div
              onClick={handleBlowCandle}
              className="cursor-pointer group flex flex-col items-center py-4 transition-transform hover:scale-105 active:scale-95"
            >
              <div
                className={`w-6 h-8 bg-gradient-to-t from-amber-400 to-yellow-200 rounded-full blur-[0.6px] mb-1 transition-all duration-700 ${
                  candleBlown ? "opacity-0 scale-0" : "flame-anim opacity-100"
                }`}
              />
              <div className="w-2.5 h-14 bg-gradient-to-b from-pink-200 via-pink-400 to-rose-500 rounded-t-sm shadow-inner" />
              <div className="w-36 h-10 bg-pink-950/70 border border-pink-500/40 rounded-t-2xl -mt-0.5 flex items-center justify-center text-[11px] tracking-wider text-pink-200 font-semibold shadow-lg">
                {candleBlown ? "WISH SENT TO STARS ✨" : "TAP TO BLOW CANDLE"}
              </div>
            </div>

            <p className="text-xs text-pink-300/80 font-medium">
              {candleBlown ? (
                <span className="text-pink-300 text-sm">
                  May every single wish you made today come true! ❤️
                </span>
              ) : (
                <span className="animate-pulse">
                  Close your eyes, make a wish, and tap the flame ✨
                </span>
              )}
            </p>

            {candleBlown && (
              <button
                onClick={() => setCurrentStep("journey")}
                className="px-7 py-3 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-medium shadow-[0_0_25px_rgba(244,63,94,0.45)] transition-all text-xs sm:text-sm animate-in fade-in"
              >
                Our Journey & What Happened →
              </button>
            )}
          </div>
        )}

        {/* SCREEN 2: THE HONEST TIMELINE */}
        {currentStep === "journey" && (
          <div className="flex flex-col space-y-4 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-[11px] tracking-widest text-pink-400 uppercase font-semibold">
                Real & Unfiltered
              </span>
              <h2
                className={`${playfair.className} text-2xl sm:text-3xl text-white`}
              >
                Why We Are Celebrating Now
              </h2>
            </div>

            <div className="space-y-2.5 my-1">
              {/* Chapter 1 */}
              <div className="p-3.5 rounded-2xl bg-white/[0.025] border border-pink-500/15 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  01
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xs sm:text-sm">
                    May 30 — Oceans Apart in the US
                  </h3>
                  <p className="text-xs text-pink-100/70 mt-1 leading-relaxed">
                    It was your birthday and you were in the United States. All
                    I wanted was to hug you, hold your hand, and feed you a
                    slice of birthday cake.
                  </p>
                </div>
              </div>

              {/* Chapter 2 - Mental & Financial Struggle */}
              <div className="p-3.5 rounded-2xl bg-white/[0.025] border border-pink-500/15 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  02
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xs sm:text-sm">
                    June — Welcoming You Home
                  </h3>
                  <p className="text-xs text-pink-100/70 mt-1 leading-relaxed">
                    When you finally landed back in India, I was in one of the
                    lowest phases of my life. Not only was I completely broken
                    financially, but I was also mentally drained, overwhelmed,
                    and completely exhausted. I couldn&apos;t give you the
                    welcome you deserved, and it broke my heart inside.
                  </p>
                </div>
              </div>

              {/* Chapter 3 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/15 to-rose-500/15 border border-pink-500/30 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  03
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xs sm:text-sm">
                    Today — No More Excuses
                  </h3>
                  <p className="text-xs text-pink-100/80 mt-1 leading-relaxed">
                    Today is just for you and me. With our cake, our rose, and
                    our unspoken promises, I am celebrating the most precious
                    person in my world.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStep("intro")}
                className="text-xs text-pink-300/70 hover:text-white transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep("reasons")}
                className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-medium transition shadow-md shadow-pink-600/30"
              >
                Why You’re My Rain →
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: REASONS YOU'RE MY RAIN (INTERACTIVE CARDS) */}
        {currentStep === "reasons" && (
          <div className="flex flex-col space-y-4 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-[11px] tracking-widest text-pink-400 uppercase font-semibold">
                Special Confessions
              </span>
              <h2
                className={`${playfair.className} text-2xl sm:text-3xl text-white`}
              >
                Rain in a Dry Land
              </h2>
              <p className="text-xs text-pink-100/60">
                Tap each memory card to reveal what you mean to me.
              </p>
            </div>

            <div className="space-y-2.5 my-1">
              {reasons.map((r) => (
                <div
                  key={r.id}
                  onClick={() => toggleReason(r.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                    r.revealed
                      ? "bg-gradient-to-r from-pink-500/10 to-rose-500/15 border-pink-400/40 shadow-inner"
                      : "bg-white/[0.03] border-pink-500/20 hover:border-pink-400/50 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400">
                      Reason #{r.id}
                    </span>
                    <span className="text-[11px] text-pink-300/70">
                      {r.revealed ? "✨ Revealed" : "Tap to read →"}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white mt-1">
                    {r.teaser}
                  </h4>
                  {r.revealed && (
                    <p className="text-xs text-pink-100/80 mt-2 pt-2 border-t border-pink-500/20 leading-relaxed animate-in fade-in">
                      {r.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStep("journey")}
                className="text-xs text-pink-300/70 hover:text-white transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep("vouchers")}
                className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-medium transition shadow-md shadow-pink-600/30"
              >
                Your Love Coupons →
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: BIRTHDAY VOUCHERS */}
        {currentStep === "vouchers" && (
          <div className="flex flex-col space-y-4 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-[11px] tracking-widest text-pink-400 uppercase font-semibold">
                Only for You
              </span>
              <h2
                className={`${playfair.className} text-2xl sm:text-3xl text-white`}
              >
                Akhila&apos;s Gift Coupons
              </h2>
              <p className="text-xs text-pink-100/60">
                Claim these anytime. Valid with me forever.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-1">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  onClick={() => !v.claimed && handleClaimVoucher(v.id)}
                  className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between h-28 group ${
                    v.claimed
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "bg-white/[0.03] border-pink-500/20 hover:border-pink-500/50 hover:bg-white/[0.05]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-pink-400 uppercase tracking-widest font-bold">
                        Coupon #{v.id}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                        {v.tag}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white mt-1 leading-snug">
                      {v.title}
                    </div>
                    <p className="text-[10px] text-pink-100/60 mt-0.5 line-clamp-1">
                      {v.desc}
                    </p>
                  </div>
                  <div
                    className={`text-[11px] font-medium transition-colors ${
                      v.claimed
                        ? "text-emerald-400 font-bold"
                        : "text-pink-300/80 group-hover:text-pink-200"
                    }`}
                  >
                    {v.claimed ? "✓ CLAIMED & LOCKED" : "Tap to redeem →"}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStep("reasons")}
                className="text-xs text-pink-300/70 hover:text-white transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep("letter")}
                className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-medium transition shadow-md shadow-pink-600/30"
              >
                Read What I Wrote You →
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: THE LETTER & REAL-TIME NOVEMBER 4 COUNTDOWN */}
        {currentStep === "letter" && (
          <div className="flex flex-col space-y-3.5 animate-in fade-in duration-300">
            {/* Live Real-time Countdown Banner to November 4 */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/15 to-purple-500/10 border border-pink-500/30 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-pink-300">
                Road to Our 1st Anniversary • November 4 💍
              </span>
              <div className="flex items-center justify-center gap-3 mt-1.5 font-mono text-white font-semibold text-sm sm:text-base">
                <div className="flex flex-col items-center">
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-pink-500/20">
                    {timeLeft.days}
                  </span>
                  <span className="text-[9px] font-sans text-pink-300/70 font-normal mt-0.5">
                    DAYS
                  </span>
                </div>
                <span className="text-pink-400 pb-2">:</span>
                <div className="flex flex-col items-center">
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-pink-500/20">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-sans text-pink-300/70 font-normal mt-0.5">
                    HRS
                  </span>
                </div>
                <span className="text-pink-400 pb-2">:</span>
                <div className="flex flex-col items-center">
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-pink-500/20">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-sans text-pink-300/70 font-normal mt-0.5">
                    MIN
                  </span>
                </div>
                <span className="text-pink-400 pb-2">:</span>
                <div className="flex flex-col items-center">
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-pink-500/20 text-rose-300">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-sans text-pink-300/70 font-normal mt-0.5">
                    SEC
                  </span>
                </div>
              </div>
            </div>

            {/* Letter Content Styled like Silk Parchment (Zero Scrollbar) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.035] border border-pink-500/15 space-y-3 text-xs sm:text-[13px] leading-relaxed text-pink-100/90 font-light max-h-[48vh] overflow-y-auto pr-1">
              <p>
                Everything between us started so unexpectedly. Even though I
                held back a few things at the very beginning, I am so glad I
                opened up and shared my dark times with you as soon as I did. I
                am genuinely so sorry for hiding anything back then.
              </p>
              <p>
                You are truly the best thing that ever happened to me.{" "}
                <span className="text-pink-200 font-normal">
                  Like rain falling over a dry, parched land, you walked right
                  into my life.
                </span>{" "}
                I was trapped in toxic chaos, and because of you, I found the
                strength to pull myself out.
              </p>
              <p>
                After knowing my dark secrets and past struggles, you still
                chose to stay with me. My hardest days seem easy only because of
                you. You give your absolute best to keep me happy and support me
                unconditionally when times are bad.
              </p>
              <p>
                There were days when I felt like I was done and that my life was
                over, but just looking at you gave me the motivation that I can
                do anything. I know I may not be the best person you’ve had in
                your life, and I’m definitely far from perfect. I am truly sorry
                for losing my temper and getting mad at you sometimes.
              </p>
              <p>
                Things are in bad shape nowadays, but I believe with all my
                heart that we can figure it out. Our 1-year anniversary on
                November 4th is approaching. We will complete 1 year together.
                Stand beside me, and I promise I will conquer whatever comes in
                our way. I will get stable, do something big, and make you so
                proud.
              </p>

              <div className="pt-2 text-right border-t border-pink-500/20">
                <p
                  className={`${playfair.className} italic text-pink-300 text-sm sm:text-base leading-snug`}
                >
                  I love you ra ladduu...
                  <br />
                  Na bangaram, na lillu, na akki, na Akhila. ❤️
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-1">
              <button
                onClick={() => setCurrentStep("vouchers")}
                className="text-xs text-pink-300/70 hover:text-white transition"
              >
                ← Back
              </button>
              <button
                onClick={triggerGrandFinale}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:opacity-95 text-white text-xs sm:text-sm font-semibold shadow-[0_0_25px_rgba(244,63,94,0.5)] transition active:scale-95"
              >
                Celebrate Us Forever 🥂✨
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
