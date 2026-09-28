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

/* Butterfly particle data structure for full-screen natural flight */
interface Butterfly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  wingAngle: number;
  wingSpeed: number;
  size: number;
  hue: number; // For iridescent pink, lavender, gold, and violet variations
  alpha: number;
  angle: number;
}

export default function AkhilaBirthdaySpecial() {
  const [currentStep, setCurrentStep] = useState<
    "intro" | "journey" | "reasons" | "vouchers" | "letter"
  >("intro");
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Animation sequence states: 'candle' -> 'shooting' -> 'burst' -> 'tree'
  const [animStage, setAnimStage] = useState<
    "candle" | "shooting" | "burst" | "tree"
  >("candle");

  // Activate butterflies after the tree emerges and persist forever
  const [showButterflies, setShowButterflies] = useState<boolean>(false);

  // Canvas references for tree and full-screen butterflies
  const treeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const butterflyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const treeAnimRef = useRef<number | null>(null);
  const butterflyAnimRef = useRef<number | null>(null);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      let targetYear = now.getFullYear();
      let targetDate = new Date(targetYear, 10, 4, 0, 0, 0); // Month 10 = November (0-indexed)

      if (now.getTime() > targetDate.getTime()) {
        targetDate = new Date(targetYear + 1, 10, 4, 0, 0, 0);
      }

      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const playMusic = async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.volume = 0.7;
      await audioRef.current.play();
      setIsPlayingMusic(true);
    } catch {
      setIsPlayingMusic(false);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      playMusic();
    }
  };

  useEffect(() => {
    if (!showButterflies) return;

    const canvas = butterflyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Instantiate realistic, gracefully drifting romantic butterflies
    const butterflies: Butterfly[] = [];
    const count = window.innerWidth < 640 ? 12 : 22;

    const colorPalettes = [
      {
        primary: "rgba(251, 113, 133, 0.85)",
        glow: "rgba(244, 63, 94, 0.5)",
        body: "#be123c",
      }, // Rose Pink
      {
        primary: "rgba(244, 114, 182, 0.85)",
        glow: "rgba(236, 72, 153, 0.5)",
        body: "#9d174d",
      }, // Soft Fuchsia
      {
        primary: "rgba(252, 211, 77, 0.85)",
        glow: "rgba(245, 158, 11, 0.5)",
        body: "#b45309",
      }, // Golden Sunlight
      {
        primary: "rgba(216, 180, 254, 0.85)",
        glow: "rgba(168, 85, 247, 0.5)",
        body: "#6b21a8",
      }, // Lavender Dream
      {
        primary: "rgba(254, 205, 211, 0.9)",
        glow: "rgba(251, 113, 133, 0.4)",
        body: "#e11d48",
      }, // Peach Blossom
    ];

    for (let i = 0; i < count; i++) {
      butterflies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.2,
        targetX: Math.random() * canvas.width,
        targetY: Math.random() * canvas.height,
        wingAngle: Math.random() * Math.PI,
        wingSpeed: Math.random() * 0.18 + 0.16,
        size: Math.random() * 7 + 10,
        hue: i % colorPalettes.length,
        alpha: Math.random() * 0.3 + 0.7,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // Helper to draw realistic anatomical wings with glowing patterns
    const drawButterfly = (b: Butterfly) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle + Math.PI / 2); // Orient forward flight

      const palette = colorPalettes[b.hue];
      const flap = Math.cos(b.wingAngle); // 3D Flap scaling factor: 1 to -1
      const size = b.size;

      // Glow aura
      ctx.shadowColor = palette.glow;
      ctx.shadowBlur = 10;

      // Draw Left Wing
      ctx.save();
      ctx.scale(flap, 1);
      ctx.beginPath();
      // Forewing (Upper)
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -size * 1.2,
        -size * 1.2,
        -size * 1.8,
        -size * 0.4,
        -size * 1.5,
        size * 0.3,
      );
      ctx.bezierCurveTo(
        -size * 1.2,
        size * 0.7,
        -size * 0.5,
        size * 0.4,
        0,
        size * 0.2,
      );
      ctx.fillStyle = palette.primary;
      ctx.fill();

      // Wing decorative inner highlight
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -size * 0.7,
        -size * 0.7,
        -size * 1.1,
        -size * 0.2,
        -size * 0.8,
        size * 0.2,
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fill();

      // Hindwing (Lower)
      ctx.beginPath();
      ctx.moveTo(0, size * 0.2);
      ctx.bezierCurveTo(
        -size * 1.1,
        size * 0.6,
        -size * 0.8,
        size * 1.4,
        -size * 0.2,
        size * 1.1,
      );
      ctx.bezierCurveTo(-size * 0.1, size * 0.9, 0, size * 0.5, 0, size * 0.2);
      ctx.fillStyle = palette.primary;
      ctx.fill();
      ctx.restore();

      // Draw Right Wing (mirrored scale)
      ctx.save();
      ctx.scale(-flap, 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -size * 1.2,
        -size * 1.2,
        -size * 1.8,
        -size * 0.4,
        -size * 1.5,
        size * 0.3,
      );
      ctx.bezierCurveTo(
        -size * 1.2,
        size * 0.7,
        -size * 0.5,
        size * 0.4,
        0,
        size * 0.2,
      );
      ctx.fillStyle = palette.primary;
      ctx.fill();

      // Right inner highlight
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -size * 0.7,
        -size * 0.7,
        -size * 1.1,
        -size * 0.2,
        -size * 0.8,
        size * 0.2,
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fill();

      // Right Hindwing
      ctx.beginPath();
      ctx.moveTo(0, size * 0.2);
      ctx.bezierCurveTo(
        -size * 1.1,
        size * 0.6,
        -size * 0.8,
        size * 1.4,
        -size * 0.2,
        size * 1.1,
      );
      ctx.bezierCurveTo(-size * 0.1, size * 0.9, 0, size * 0.5, 0, size * 0.2);
      ctx.fillStyle = palette.primary;
      ctx.fill();
      ctx.restore();

      // Slender Butterfly Body & Head
      ctx.beginPath();
      ctx.ellipse(0, size * 0.4, size * 0.1, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = palette.body;
      ctx.fill();

      // Antennae
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-size * 0.05, 0);
      ctx.quadraticCurveTo(-size * 0.3, -size * 0.4, -size * 0.5, -size * 0.45);
      ctx.moveTo(size * 0.05, 0);
      ctx.quadraticCurveTo(size * 0.3, -size * 0.4, size * 0.5, -size * 0.45);
      ctx.stroke();

      ctx.restore();
    };

    const renderButterflies = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      butterflies.forEach((b) => {
        // Natural flapping frequency
        b.wingAngle += b.wingSpeed;

        // Steering towards target position with smooth fluttering noise
        const dx = b.targetX - b.x;
        const dy = b.targetY - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 40 || Math.random() < 0.015) {
          b.targetX = Math.random() * canvas.width;
          b.targetY = Math.random() * canvas.height;
        }

        // Steer velocity with slight wave oscillation
        b.vx += (dx / dist) * 0.045 + (Math.random() - 0.5) * 0.25;
        b.vy += (dy / dist) * 0.045 + (Math.random() - 0.5) * 0.25;

        // Dampen velocity to prevent excessive speeds
        b.vx *= 0.96;
        b.vy *= 0.96;

        b.x += b.vx;
        b.y += b.vy;

        // Face movement direction
        const flightHeading = Math.atan2(b.vy, b.vx);
        b.angle += (flightHeading - b.angle) * 0.08;

        // Boundary wrapping
        if (b.x < -50) b.x = canvas.width + 40;
        if (b.x > canvas.width + 50) b.x = -40;
        if (b.y < -50) b.y = canvas.height + 40;
        if (b.y > canvas.height + 50) b.y = -40;

        drawButterfly(b);
      });

      butterflyAnimRef.current = requestAnimationFrame(renderButterflies);
    };

    renderButterflies();

    return () => {
      if (butterflyAnimRef.current)
        cancelAnimationFrame(butterflyAnimRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [showButterflies]);

  useEffect(() => {
    if (animStage !== "tree") return;

    const canvas = treeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 540);
    const height = (canvas.height = 360);

    interface Leaf {
      x: number;
      y: number;
      size: number;
      color: string;
      alpha: number;
      rotation: number;
    }

    interface PetalParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rotation: number;
      vRot: number;
      alpha: number;
      color: string;
    }

    interface Firefly {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      pulseSpeed: number;
      color: string;
    }

    interface BranchSegment {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      branchWidth: number;
      depth: number;
    }

    const leaves: Leaf[] = [];
    const fallingPetals: PetalParticle[] = [];
    const fireflies: Firefly[] = [];
    const branches: BranchSegment[] = [];

    // Warm golden-pink glowing fireflies in the tree canopy
    for (let i = 0; i < 30; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.9,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.5 + 0.4,
        pulseSpeed: Math.random() * 0.05 + 0.02,
        color: Math.random() > 0.45 ? "#fcd34d" : "#f472b6",
      });
    }

    // Branch generator with organic spread
    const generateBranches = (
      startX: number,
      startY: number,
      len: number,
      angle: number,
      branchWidth: number,
      depth: number,
    ) => {
      const endX = startX + len * Math.sin((angle * Math.PI) / 180);
      const endY = startY - len * Math.cos((angle * Math.PI) / 180);

      branches.push({ startX, startY, endX, endY, branchWidth, depth });

      if (depth >= 7 || branchWidth < 2.4) {
        const clusterCount = Math.floor(Math.random() * 4) + 4;
        for (let k = 0; k < clusterCount; k++) {
          const offsetX = (Math.random() - 0.5) * 32;
          const offsetY = (Math.random() - 0.5) * 28;
          const petalPalettes = [
            "#fb7185",
            "#f43f5e",
            "#ec4899",
            "#fda4af",
            "#ffe4e6",
            "#f472b6",
            "#fde047",
          ];
          leaves.push({
            x: endX + offsetX,
            y: endY + offsetY,
            size: Math.random() * 6.5 + 5.5,
            color:
              petalPalettes[Math.floor(Math.random() * petalPalettes.length)],
            alpha: Math.random() * 0.35 + 0.65,
            rotation: Math.random() * Math.PI * 2,
          });
        }
        return;
      }

      const numBranches = depth === 0 ? 3 : Math.random() > 0.45 ? 3 : 2;
      for (let i = 0; i < numBranches; i++) {
        const spread = depth === 0 ? 46 : 28 + Math.random() * 12;
        const subAngle =
          numBranches === 3
            ? angle + (i - 1) * spread + (Math.random() - 0.5) * 10
            : angle + (i === 0 ? -spread : spread) + (Math.random() - 0.5) * 8;
        const lengthFactor = 0.73 + Math.random() * 0.13;
        generateBranches(
          endX,
          endY,
          len * lengthFactor,
          subAngle,
          branchWidth * 0.72,
          depth + 1,
        );
      }
    };

    generateBranches(width / 2, height - 10, 82, 0, 17, 0);

    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number,
      rotation: number,
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.beginPath();
      const topCurveHeight = size * 0.3;
      context.moveTo(0, topCurveHeight);
      context.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      context.bezierCurveTo(
        -size / 2,
        (size + topCurveHeight) / 2,
        0,
        (size + topCurveHeight) / 1.15,
        0,
        size,
      );
      context.bezierCurveTo(
        0,
        (size + topCurveHeight) / 1.15,
        size / 2,
        (size + topCurveHeight) / 2,
        size / 2,
        topCurveHeight,
      );
      context.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      context.closePath();
      context.fill();
      context.restore();
    };

    let growthProgress = 0;
    let bloomProgress = 0;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      if (growthProgress < 1) {
        growthProgress += 0.024;
        if (growthProgress > 1) growthProgress = 1;
      } else if (bloomProgress < 1) {
        bloomProgress += 0.032;
        if (bloomProgress > 1) bloomProgress = 1;
      }

      // Root mound
      const moundGrad = ctx.createRadialGradient(
        width / 2,
        height - 6,
        4,
        width / 2,
        height - 6,
        75,
      );
      moundGrad.addColorStop(0, "#78350f");
      moundGrad.addColorStop(0.5, "#38160e");
      moundGrad.addColorStop(1, "transparent");
      ctx.fillStyle = moundGrad;
      ctx.beginPath();
      ctx.ellipse(
        width / 2,
        height - 6,
        90 * growthProgress,
        18 * growthProgress,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // Branch trunk rendering with mahogany/gold gradient
      const visibleBranchesCount = Math.floor(branches.length * growthProgress);
      for (let i = 0; i < visibleBranchesCount; i++) {
        const b = branches[i];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(b.startX, b.startY);
        ctx.lineTo(b.endX, b.endY);
        ctx.lineCap = "round";

        const grad = ctx.createLinearGradient(
          b.startX,
          b.startY,
          b.endX,
          b.endY,
        );
        grad.addColorStop(0, "#451a03");
        grad.addColorStop(0.55, "#78350f");
        grad.addColorStop(1, "#b45309");

        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(
          b.branchWidth * (1 - (b.depth / 8) * 0.3),
          1.8,
        );
        ctx.shadowColor = "rgba(244, 63, 94, 0.25)";
        ctx.shadowBlur = b.depth > 3 ? 10 : 3;
        ctx.stroke();
        ctx.restore();
      }

      // Blooming hearts
      if (bloomProgress > 0) {
        const visibleLeaves = Math.floor(leaves.length * bloomProgress);
        for (let i = 0; i < visibleLeaves; i++) {
          const l = leaves[i];
          const sway = Math.sin(frame * 0.03 + i) * 1.6;
          drawHeart(
            ctx,
            l.x + sway,
            l.y,
            l.size * bloomProgress,
            l.color,
            l.alpha,
            l.rotation + Math.sin(frame * 0.02 + i) * 0.12,
          );
        }
      }

      // Falling petals
      if (
        bloomProgress > 0.55 &&
        Math.random() < 0.28 &&
        fallingPetals.length < 50
      ) {
        const sourceLeaf = leaves[Math.floor(Math.random() * leaves.length)];
        if (sourceLeaf) {
          fallingPetals.push({
            x: sourceLeaf.x,
            y: sourceLeaf.y,
            vx: (Math.random() - 0.25) * 1.3,
            vy: Math.random() * 0.95 + 0.85,
            size: Math.random() * 4 + 4,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.05,
            alpha: 0.85,
            color: sourceLeaf.color,
          });
        }
      }

      // Update falling petals
      for (let p = fallingPetals.length - 1; p >= 0; p--) {
        const petal = fallingPetals[p];
        petal.x += petal.vx + Math.sin(frame * 0.02 + p) * 0.6;
        petal.y += petal.vy;
        petal.rotation += petal.vRot;
        if (petal.y > height - 12) {
          petal.alpha -= 0.025;
        }
        drawHeart(
          ctx,
          petal.x,
          petal.y,
          petal.size,
          petal.color,
          petal.alpha,
          petal.rotation,
        );
        if (petal.alpha <= 0 || petal.y > height + 20) {
          fallingPetals.splice(p, 1);
        }
      }

      // Firefly pulses
      fireflies.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < 10 || f.x > width - 10) f.vx *= -1;
        if (f.y < 10 || f.y > height - 20) f.vy *= -1;

        const pulse = f.baseAlpha + Math.sin(frame * f.pulseSpeed) * 0.35;
        ctx.save();
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = f.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, pulse));
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      });

      treeAnimRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (treeAnimRef.current) cancelAnimationFrame(treeAnimRef.current);
    };
  }, [animStage]);

  const handleBlowCandle = () => {
    if (animStage !== "candle") return;

    // Start background romantic soundtrack immediately
    playMusic();

    // Trigger arrow flight
    setAnimStage("shooting");

    // Arrow strikes balloon after flight physics
    setTimeout(() => {
      setAnimStage("burst");

      // Burst of confetti & heart-toned particles
      confetti({
        particleCount: 110,
        spread: 120,
        origin: { x: 0.5, y: 0.38 },
        colors: ["#f43f5e", "#ec4899", "#fda4af", "#fcd34d", "#ffffff"],
      });

      // Sprout enchanted majestic tree with blooming hearts
      setTimeout(() => {
        setAnimStage("tree");

        // Unleash the persistent flying butterflies across the entire screen!
        setShowButterflies(true);

        confetti({
          particleCount: 65,
          spread: 85,
          origin: { x: 0.5, y: 0.55 },
          colors: ["#fb7185", "#f472b6", "#fde047"],
        });
      }, 750);
    }, 820);
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
      teaser: "Like rain on dry, parched soil...",
      content:
        "I was trapped in toxic baggage and completely drained. Your entrance into my life was soothing and brought life back into my dead world.",
      revealed: false,
    },
    {
      id: 3,
      teaser: "You give me fire to conquer anything...",
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
      particleCount: 35,
      spread: 50,
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
      tag: "ALL ON ME",
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
    const duration = 4.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 60, zIndex: 100 };

    const interval = setInterval(() => {
      const remainingTime = animationEnd - Date.now();
      if (remainingTime <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 60 * (remainingTime / duration);
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
    }, 240);
  };

  return (
    <main
      className={`${jakarta.className} relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 text-pink-100 select-none overflow-hidden`}
      style={{
        background:
          "radial-gradient(circle at 50% 15%, #2a0b1f 0%, #12040d 45%, #050104 100%)",
      }}
    >
      {/* Background Audio configured to /EdSheeran-Perfect.mp3 */}
      <audio ref={audioRef} src="/EdSheeran-Perfect.mp3" preload="auto" loop />

      {/* Global CSS for zero scrollbars & smooth animations */}
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
            transform: scale(1.15) rotate(2deg);
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
        @keyframes floatBalloon {
          0%,
          100% {
            transform: translateY(0px) rotate(-1.5deg);
          }
          50% {
            transform: translateY(-12px) rotate(2deg);
          }
        }
        .balloon-float {
          animation: floatBalloon 3.2s ease-in-out infinite;
        }
        /* Realistic Arrow Flight Path */
        @keyframes realisticArrowShot {
          0% {
            opacity: 0;
            transform: translate(-260px, 160px) rotate(-42deg) scale(0.65);
          }
          10% {
            opacity: 1;
          }
          70% {
            transform: translate(-30px, -18px) rotate(-24deg) scale(1);
          }
          100% {
            opacity: 1;
            transform: translate(2px, 0px) rotate(-18deg) scale(1.02);
          }
        }
        .arrow-realistic-flight {
          animation: realisticArrowShot 0.82s cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }
        /* Realistic Balloon Shockwave and Pop */
        @keyframes realisticPop {
          0% {
            transform: scale(1);
            filter: brightness(1);
            opacity: 1;
          }
          35% {
            transform: scale(1.3) rotate(3deg);
            filter: brightness(2) drop-shadow(0 0 35px #f43f5e);
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
        .balloon-realistic-pop {
          animation: realisticPop 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }
        @keyframes popShockwave {
          0% {
            transform: scale(0.2);
            opacity: 1;
            border-width: 6px;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
            border-width: 1px;
          }
        }
        .pop-shockwave {
          animation: popShockwave 0.5s ease-out forwards;
        }
      `}</style>

      {/* FULL-SCREEN BUTTERFLIES CANVAS (Appears after tree and persists across all views) */}
      <canvas
        ref={butterflyCanvasRef}
        className={`fixed inset-0 w-full h-full pointer-events-none z-20 transition-opacity duration-1000 ${
          showButterflies ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Floating Header Audio Pill */}
      <div className="absolute top-4 inset-x-0 max-w-xl mx-auto px-5 flex items-center justify-between z-30">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-pink-500/20 backdrop-blur-md text-[11px] text-pink-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Made for Akhila</span>
        </div>

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
      <div className="w-full max-w-xl rounded-3xl p-5 sm:p-7 relative z-10 overflow-hidden bg-white/[0.035] backdrop-blur-2xl border border-pink-400/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] transition-all duration-300">
        {/* STEP 1: Intro with Candle, Cupid Arrow, Heart Balloon, and Majestic Tree */}
        {currentStep === "intro" && (
          <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in duration-300">
            <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 font-medium">
              May 30 • Belated Celebration
            </span>

            {/* Stage 1: Lit Candle */}
            {animStage === "candle" && (
              <>
                <h1
                  className={`${playfair.className} text-2xl sm:text-3xl font-normal leading-snug text-white`}
                >
                  Happy Belated Birthday,
                  <br />
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200">
                    Na Bangaram Akhila
                  </span>
                </h1>

                <p className="text-xs text-pink-100/70 max-w-md font-light leading-relaxed">
                  You were oceans away in the US on May 30th. When you returned
                  home, I couldn’t do anything for you. But today this room,
                  this cake, and this entire day belongs to you.
                </p>

                {/* Lit Birthday Candle */}
                <div
                  onClick={handleBlowCandle}
                  className="cursor-pointer group flex flex-col items-center py-4 transition-transform hover:scale-105 active:scale-95"
                >
                  <div className="w-5 h-7 bg-gradient-to-t from-amber-400 to-yellow-200 rounded-full blur-[0.6px] mb-1 flame-anim opacity-100" />
                  <div className="w-2.5 h-12 bg-gradient-to-b from-pink-200 via-pink-400 to-rose-500 rounded-t-sm shadow-inner" />
                  <div className="w-36 h-9 bg-pink-950/70 border border-pink-500/40 rounded-t-2xl -mt-0.5 flex items-center justify-center text-[11px] tracking-wider text-pink-200 font-semibold shadow-lg">
                    TAP TO BLOW CANDLE
                  </div>
                </div>

                <p className="text-xs text-pink-300/80 font-medium animate-pulse">
                  Make a wish, tap the candle, and see the magic ✨
                </p>
              </>
            )}

            {/* Stage 2 & 3: Cupid Arrow Shooting at Floating Heart Balloon */}
            {(animStage === "shooting" || animStage === "burst") && (
              <div className="relative w-full h-72 flex items-center justify-center overflow-hidden my-2">
                <div
                  className={`relative z-10 transition-all ${
                    animStage === "burst"
                      ? "balloon-realistic-pop"
                      : "balloon-float"
                  }`}
                >
                  <svg
                    className="w-28 h-28 filter drop-shadow-[0_0_24px_rgba(244,63,94,0.85)]"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <defs>
                      <radialGradient
                        id="balloonGloss"
                        cx="35%"
                        cy="30%"
                        r="65%"
                      >
                        <stop offset="0%" stopColor="#fda4af" />
                        <stop offset="35%" stopColor="#f43f5e" />
                        <stop offset="85%" stopColor="#be123c" />
                        <stop offset="100%" stopColor="#881337" />
                      </radialGradient>
                      <linearGradient
                        id="specularGlint"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#ffffff"
                          stopOpacity="0.85"
                        />
                        <stop
                          offset="100%"
                          stopColor="#fda4af"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M50 88 C22 68 8 50 8 32 C8 15 22 8 36 8 C44 8 48 13 50 18 C52 13 56 8 64 8 C78 8 92 15 92 32 C92 50 78 68 50 88 Z"
                      fill="url(#balloonGloss)"
                    />
                    <ellipse
                      cx="32"
                      cy="24"
                      rx="10"
                      ry="6"
                      transform="rotate(-30 32 24)"
                      fill="url(#specularGlint)"
                    />
                    <ellipse
                      cx="68"
                      cy="22"
                      rx="4"
                      ry="2.5"
                      transform="rotate(25 68 22)"
                      fill="#ffffff"
                      opacity="0.4"
                    />
                    <polygon points="47,88 53,88 54,92 46,92" fill="#be123c" />
                  </svg>
                  <svg
                    className="w-6 h-12 mx-auto -mt-1"
                    viewBox="0 0 20 40"
                    fill="none"
                  >
                    <path
                      d="M10 0 Q15 15 8 28 T12 40"
                      stroke="rgba(253,164,175,0.6)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {animStage === "burst" && (
                  <div className="absolute z-10 w-28 h-28 rounded-full border border-rose-400/80 pop-shockwave pointer-events-none" />
                )}

                {animStage === "shooting" && (
                  <div className="absolute z-20 arrow-realistic-flight pointer-events-none">
                    <div className="absolute -left-20 top-3 w-28 h-1 bg-gradient-to-r from-transparent via-amber-300/60 to-yellow-200 blur-[1px]" />
                    <svg
                      className="w-28 h-8 filter drop-shadow-[0_0_10px_#fde047]"
                      viewBox="0 0 160 40"
                      fill="none"
                    >
                      <defs>
                        <linearGradient
                          id="shaftGrad"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#78350f" />
                          <stop offset="25%" stopColor="#d97706" />
                          <stop offset="70%" stopColor="#fef08a" />
                          <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M158 20 L132 10 L138 20 L132 30 Z"
                        fill="#fbbf24"
                        stroke="#fef08a"
                        strokeWidth="1"
                      />
                      <line
                        x1="138"
                        y1="20"
                        x2="158"
                        y2="20"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="22"
                        y="18.5"
                        width="116"
                        height="3"
                        rx="1.5"
                        fill="url(#shaftGrad)"
                      />
                      <g fill="#f43f5e" stroke="#fb7185" strokeWidth="0.8">
                        <path d="M4 14 Q16 14 26 20 Q16 20 8 20 Z" />
                        <path d="M4 26 Q16 26 26 20 Q16 20 8 20 Z" />
                        <path
                          d="M12 9 Q22 10 32 19 Q22 19 14 18 Z"
                          fill="#fda4af"
                        />
                        <path
                          d="M12 31 Q22 30 32 21 Q22 21 14 22 Z"
                          fill="#fda4af"
                        />
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            )}

            {/* Stage 4: Sprouted Majestic Enchanted Tree */}
            {animStage === "tree" && (
              <div className="flex flex-col items-center space-y-2 animate-in fade-in duration-500 w-full">
                <div className="relative w-full h-[360px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-transparent via-rose-950/20 to-black/40 border border-pink-500/20 shadow-inner">
                  <canvas ref={treeCanvasRef} className="w-full h-full block" />
                  <div className="absolute top-10 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
                </div>

                <div className="space-y-1 pt-1">
                  <h2
                    className={`${playfair.className} text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-amber-200 font-semibold tracking-wide`}
                  >
                    Belated Happy Birthday Bangaram ❤️
                  </h2>
                  <p className="text-[11px] text-pink-300/80 font-light tracking-widest uppercase">
                    May 30 to Forever • From My Heart
                  </p>
                </div>

                <button
                  onClick={() => setCurrentStep("journey")}
                  className="mt-2 px-8 py-2.5 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 hover:opacity-95 text-white font-medium shadow-[0_0_25px_rgba(244,63,94,0.45)] transition-all text-xs sm:text-sm active:scale-95"
                >
                  Continue Our Journey →
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: The Honest Timeline */}
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
              <div className="p-3.5 rounded-2xl bg-white/[0.025] border border-pink-500/15 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  01
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xs sm:text-sm">
                    May 30 — Oceans Apart in the US
                  </h3>
                  <p className="text-xs text-pink-100/70 mt-1 leading-relaxed">
                    It was your birthday and you were thousands of miles away in
                    the United States. All I wanted was to hug you, hold your
                    hand, and feed you a slice of cake.
                  </p>
                </div>
              </div>

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

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/15 to-rose-500/15 border border-pink-500/30 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  03
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xs sm:text-sm">
                    Today — Just You & Me
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

        {/* STEP 3: Special Confessions / Rain in Dry Land */}
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
                Tap each card to reveal what you mean to me.
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

        {/* STEP 4: Vouchers */}
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

        {/* STEP 5: Heartfelt Letter & Dynamic November 4 Anniversary Timer */}
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
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.035] border border-pink-500/15 space-y-3 text-xs sm:text-[13px] leading-relaxed text-pink-100/90 font-light max-h-[46vh] overflow-y-auto pr-1">
              <p>
                Everything between us started so unexpectedly. Even though I
                held back a few things at the very beginning, I am so grateful I
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
                you. You do everything to keep a smile on my face and support me
                unconditionally when times are bad.
              </p>
              <p>
                Whenever I felt like I was completely done and that life was
                over, just looking at you gave me the motivation that I can do
                anything. I know I may not be the best person or that perfect,
                and I&apos;m deeply sorry for losing my temper and getting mad
                at you sometimes. But whatever I am, I genuinely love you so
                much.
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
