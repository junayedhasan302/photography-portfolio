
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { photos } from "@/data/photos";

type SignaturePoint = {
  x: number;
  y: number;
  time: number;
};

export default function Hero() {
  const [heroPhoto, setHeroPhoto] = useState(photos[0]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Rotate featured photos
  useEffect(() => {
    if (photos.length < 2) return;

    function changePhoto() {
      setHeroPhoto((current) => {
        const available = photos.filter(
          (photo) => photo.id !== current.id,
        );

        return available[
          Math.floor(Math.random() * available.length)
        ];
      });
    }

    changePhoto();

    const interval = setInterval(changePhoto, 30_000);

    return () => clearInterval(interval);
  }, []);

  // Draw signature trail
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Respect reduced motion preferences
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let width = 0;
    let height = 0;
    let animationId = 0;

    const points: SignaturePoint[] = [];

    // Signature settings
    const trailDuration = 1800;
    const maxPoints = 500;
    const minPointDistance = 2.5;

    // Main line color
    const LINE_COLOR = "#80683f";

    // Outer glow color
    const GLOW_COLOR = "#BEBEBE";

    // Leading tip color
    const TIP_COLOR = "#FFFFFF";

    // Resize canvas
    function resizeCanvas() {
      const rect = section!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);

      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Track pointer movement
    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;

      const rect = section!.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const now = performance.now();

      const previous = points[points.length - 1];

      if (previous) {
        const dx = x - previous.x;
        const dy = y - previous.y;
        const distance = Math.hypot(dx, dy);

        // Ignore tiny pointer movements
        if (distance < minPointDistance) return;

        // Interpolate fast movements
        const steps = Math.max(1, Math.ceil(distance / 2));

        for (let i = 1; i <= steps; i++) {
          const progress = i / steps;

          points.push({
            x: previous.x + dx * progress,
            y: previous.y + dy * progress,
            time: now,
          });
        }
      } else {
        points.push({ x, y, time: now });
      }

      // Limit stored points
      if (points.length > maxPoints) {
        points.splice(0, points.length - maxPoints);
      }
    }

    // Draw smooth curves
    function traceSignature() {
      if (points.length < 2) return;

      ctx!.beginPath();
      ctx!.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;

        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        ctx!.bezierCurveTo(
          cp1x,
          cp1y,
          cp2x,
          cp2y,
          p2.x,
          p2.y,
        );
      }
    }

    // Animate signature
    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);

      // Remove expired points
      while (
        points.length > 0 &&
        time - points[0].time > trailDuration
      ) {
        points.shift();
      }

      if (points.length > 1) {
        const last = points[points.length - 1];
        const age = time - last.time;
        const opacity = Math.max(0, 1 - age / trailDuration);

        ctx!.save();

        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";

        // Draw subtle glow
        traceSignature();
        ctx!.lineWidth = 2.2;
        ctx!.strokeStyle = GLOW_COLOR;
        ctx!.globalAlpha = 0.12;
        ctx!.shadowBlur = 7;
        ctx!.shadowColor = GLOW_COLOR;
        ctx!.stroke();

        // Draw fine signature
        traceSignature();
        ctx!.lineWidth = 1.1;
        ctx!.strokeStyle = LINE_COLOR;
        ctx!.globalAlpha = 0.72 * opacity;
        ctx!.shadowBlur = 0;
        ctx!.stroke();

        // Highlight leading tip
        if (age < 180) {
          ctx!.beginPath();
          ctx!.arc(last.x, last.y, 1.1, 0, Math.PI * 2);
          ctx!.fillStyle = TIP_COLOR;
          ctx!.globalAlpha = 0.55 * opacity;
          ctx!.fill();
        }

        ctx!.restore();
      }

      animationId = requestAnimationFrame(draw);
    }

    // Initialize canvas
    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(section);

    section.addEventListener("pointermove", handlePointerMove);

    animationId = requestAnimationFrame(draw);

    // Clean up animation and listeners
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      section.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Update photo parallax
  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setMouse({ x, y });
  }

  // Reset photo position
  function handleMouseLeave() {
    setMouse({ x: 0, y: 0 });
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden px-5 py-10 pb-20 sm:px-8 sm:py-12 sm:pb-20 lg:min-h-[calc(100svh-5rem)] lg:px-12 lg:py-14 lg:pb-16"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 -z-10 h-96 w-96 rounded-full bg-accent/5 blur-[120px]"
      />

      {/* Signature canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      />

      {/* Hero content */}
      <div className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Introduction */}
        <div className="order-1 lg:order-1">
          <p className="mb-6 w-fit text-[10px] tracking-[0.35em] text-accent uppercase sm:mb-8 sm:text-xs">
            Independent Photographer · Bangladesh
          </p>

          {/* Profile and name */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative z-30 h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-surface sm:h-28 sm:w-28">
              <Image
                src="/images/junayed-portrait.jpg"
                alt="Junayed Hasan"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            <div>
              <p className="mb-2 w-fit text-[9px] tracking-[0.25em] text-muted uppercase">
                Behind the lens
              </p>

              <h1 className="w-fit text-4xl leading-tight font-light tracking-[-0.05em] sm:text-6xl">
                Junayed
                <br />
                <span className="font-serif italic text-accent">
                  Hasan.
                </span>
              </h1>
            </div>
          </div>

          {/* Hero description */}
          <div className="mt-6 max-w-sm border-l border-accent/50 pl-5 sm:mt-9">
            <p className="w-fit text-sm leading-7 text-muted sm:text-base sm:leading-8">
              Finding extraordinary stories in ordinary moments.
            </p>
          </div>

          {/* Portfolio link */}
          <Link
            href="#work"
            className="group mt-7 inline-flex items-center gap-4 border-b border-border pb-3 text-xs tracking-[0.2em] uppercase transition-colors hover:border-accent sm:mt-9"
          >
            Explore my work

            <span className="text-accent transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </Link>

          {/* Photographer signature */}
          <div className="mt-8 max-w-xs sm:mt-12">
            <div className="mb-4 h-px w-12 bg-[#80683f]" />

            <p className="text-[9px] tracking-[0.3em] text-muted uppercase">
              Moments · Light · Stories
            </p>

            <p className="mt-2 text-[9px] tracking-[0.2em] text-muted/70 uppercase">
              Gazipur, Bangladesh
            </p>
          </div>
        </div>

        {/* Editorial photograph card */}
        <div className="order-2 lg:order-2">
          <div className="relative mx-auto w-full max-w-[540px]">
            {/* Offset frame */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2 border border-accent/30 sm:-inset-3"
            />

            <div className="relative border border-border/60 bg-surface p-2 sm:p-3">
              {/* Editorial header */}
              <div className="flex items-center justify-between gap-3 px-1 pb-3 sm:px-2 sm:pb-4">
                <p className="text-[9px] tracking-[0.2em] text-muted uppercase sm:text-[10px]">
                  Through My Lens
                </p>

                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#80683f]"
                />
              </div>

              {/* Photograph */}
              <div className="relative overflow-hidden bg-surface">
                {heroPhoto && (
                  <div key={heroPhoto.id} className="relative">
                    {/* Photo parallax */}
                    <div
                      className="relative w-full transition-transform duration-300 ease-out motion-reduce:transition-none"
                      style={{
                        transform: `translate3d(${mouse.x * -8}px, ${mouse.y * -8}px, 0)`,
                      }}
                    >
                      <Image
                        src={heroPhoto.src}
                        alt={heroPhoto.title}
                        width={1200}
                        height={900}
                        priority
                        sizes="(max-width: 1024px) 90vw, 45vw"
                        className="block h-auto w-full object-contain"
                      />
                    </div>

                    {/* Photo overlay */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15"
                    />

                    {/* Editorial image label */}
                    <p className="pointer-events-none absolute top-4 left-4 text-[8px] tracking-[0.2em] text-white/90 uppercase sm:top-5 sm:left-5 sm:text-[9px]">
                      Photography · Visual Stories
                    </p>

                    {/* Photo title */}
                    <div className="pointer-events-none absolute right-4 bottom-4 left-4 sm:right-6 sm:bottom-6 sm:left-6">
                      <div className="mb-3 h-px w-8 bg-[#80683f]" />

                      <h2 className="text-right font-serif text-xl leading-snug text-white sm:text-2xl lg:text-3xl">
                        {heroPhoto.title}
                      </h2>
                    </div>
                  </div>
                )}
              </div>

              {/* Magazine-style caption */}
              <div className="px-1 pt-4 sm:px-2 sm:pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[9px] tracking-[0.2em] text-accent uppercase">
                      Visual journal
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-muted sm:text-sm">
                      {heroPhoto?.title}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="shrink-0 pt-1 text-lg font-light text-accent transition-transform duration-300"
                  >
                    ↗
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                  <p className="text-[8px] tracking-[0.2em] text-muted uppercase sm:text-[9px]">
                    Moments · Light · Stories
                  </p>

                  <p className="text-[8px] tracking-[0.15em] text-muted uppercase sm:text-[9px]">
                    Bangladesh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile scroll button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("work")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
        className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] tracking-[0.25em] text-muted uppercase transition-colors hover:text-accent lg:hidden"
        aria-label="See more and scroll to selected works"
      >
        <span>See More</span>

        <span className="animate-bounce text-lg" aria-hidden="true">
          ↓
        </span>
      </button>
    </section>
  );
}
