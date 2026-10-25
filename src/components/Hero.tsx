
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

  // Rotate featured photos.
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

    const interval = window.setInterval(changePhoto, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  // Draw the signature trail.
  useEffect(() => {
    const sectionElement = sectionRef.current;
    const canvasElement = canvasRef.current;

    if (!sectionElement || !canvasElement) return;

    const context = canvasElement.getContext("2d");

    if (!context) return;

    // Keep non-null references for nested animation functions.
    const section: HTMLElement = sectionElement;
    const canvas: HTMLCanvasElement = canvasElement;
    const ctx: CanvasRenderingContext2D = context;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (motionQuery.matches) return;

    let width = 0;
    let height = 0;
    let animationId = 0;

    const points: SignaturePoint[] = [];

    const trailDuration = 1800;
    const maxPoints = 500;
    const minPointDistance = 2.5;

    const LINE_COLOR = "#80683f";
    const GLOW_COLOR = "#BEBEBE";
    const TIP_COLOR = "#FFFFFF";

    // Resize the canvas to match the section.
    function resizeCanvas() {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points.length = 0;
    }

    // Track pointer movement without drawing on touch screens.
    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;

      const rect = section.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const now = performance.now();

      const previous = points[points.length - 1];

      if (previous) {
        const dx = x - previous.x;
        const dy = y - previous.y;
        const distance = Math.hypot(dx, dy);

        if (distance < minPointDistance) return;

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

      if (points.length > maxPoints) {
        points.splice(0, points.length - maxPoints);
      }
    }

    // Draw smooth curves through the pointer points.
    function traceSignature() {
      if (points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;

        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        ctx.bezierCurveTo(
          cp1x,
          cp1y,
          cp2x,
          cp2y,
          p2.x,
          p2.y,
        );
      }
    }

    // Animate and fade the signature trail.
    function draw(time: number) {
      ctx.clearRect(0, 0, width, height);

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

        ctx.save();

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        traceSignature();
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = GLOW_COLOR;
        ctx.globalAlpha = 0.12;
        ctx.shadowBlur = 7;
        ctx.shadowColor = GLOW_COLOR;
        ctx.stroke();

        traceSignature();
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = LINE_COLOR;
        ctx.globalAlpha = 0.72 * opacity;
        ctx.shadowBlur = 0;
        ctx.stroke();

        if (age < 180) {
          ctx.beginPath();
          ctx.arc(last.x, last.y, 1.1, 0, Math.PI * 2);
          ctx.fillStyle = TIP_COLOR;
          ctx.globalAlpha = 0.55 * opacity;
          ctx.fill();
        }

        ctx.restore();
      }

      animationId = window.requestAnimationFrame(draw);
    }

    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(section);

    section.addEventListener("pointermove", handlePointerMove);

    animationId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      section.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Update photo parallax on mouse movement.
  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setMouse({ x, y });
  }

  // Reset the photo position.
  function handleMouseLeave() {
    setMouse({ x: 0, y: 0 });
  }

  function scrollToWork() {
    document.getElementById("work")?.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate flex flex-col justify-start overflow-hidden px-5 pt-[clamp(2rem,3vw,3rem)] pb-16 sm:px-8 sm:pb-16 lg:px-12 lg:pb-[clamp(2.5rem,4vw,3.5rem)]"
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
        <div className="order-1 min-w-0 lg:order-1">
          <p className="mb-5 w-fit max-w-full text-[10px] tracking-[0.25em] text-accent uppercase sm:mb-8 sm:text-xs sm:tracking-[0.35em]">
            Independent Photographer · Bangladesh
          </p>

          {/* Profile and name */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative z-30 h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-surface sm:h-28 sm:w-28">
              <Image
                src="/images/junayed-portrait.jpg"
                alt="Junayed Hasan"
                fill
                sizes="(max-width: 639px) 80px, 112px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
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
          <div className="mt-5 max-w-sm border-l border-accent/50 pl-4 sm:mt-9 sm:pl-5">
            <p className="w-fit text-sm leading-7 text-muted sm:text-base sm:leading-8">
              Finding extraordinary stories in ordinary moments.
            </p>
          </div>

          {/* Portfolio link */}
          <Link
            href="#work"
            className="group mt-6 inline-flex min-h-11 items-center gap-4 border-b border-border pb-3 text-xs tracking-[0.2em] uppercase transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:mt-9"
          >
            Explore my work
            <span className="text-accent transition-transform duration-300 group-hover:translate-x-2 motion-reduce:transition-none">
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
              Dhaka, Bangladesh
            </p>
          </div>
        </div>

        {/* Editorial photograph card */}
        <div className="order-2 min-w-0 lg:order-2">
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
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#80683f]"
                />
              </div>

              {/* Photograph */}
              <div className="relative overflow-hidden bg-surface">
                {heroPhoto && (
                  <div key={heroPhoto.id} className="relative">
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
                        sizes="(max-width: 639px) 90vw, (max-width: 1023px) 85vw, 45vw"
                        className="block h-auto w-full object-contain"
                      />
                    </div>

                    {/* Photo overlay */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15"
                    />

                    {/* Editorial image label */}
                    <p className="pointer-events-none absolute top-4 left-4 text-[8px] tracking-[0.15em] text-white/90 uppercase sm:top-5 sm:left-5 sm:text-[9px] sm:tracking-[0.2em]">
                      Photography · Visual Stories
                    </p>

                    {/* Photo title */}
                    <div className="pointer-events-none absolute right-4 bottom-4 left-4 sm:right-6 sm:bottom-6 sm:left-6">
                      <div className="mb-3 ml-auto h-px w-8 bg-[#80683f]" />

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
                      A moment, preserved in time.
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="shrink-0 pt-1 text-lg font-light text-accent"
                  >
                    ↗
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                  <p className="text-[8px] tracking-[0.15em] text-muted uppercase sm:text-[9px] sm:tracking-[0.2em]">
                    Moments · Light · Stories
                  </p>

                  <p className="shrink-0 text-[8px] tracking-[0.1em] text-muted uppercase sm:text-[9px] sm:tracking-[0.15em]">
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
        onClick={scrollToWork}
        className="absolute bottom-2 left-1/2 z-30 flex min-h-11 -translate-x-1/2 flex-col items-center justify-center gap-0.5 text-[10px] tracking-[0.25em] text-muted uppercase transition-colors hover:text-accent focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
        aria-label="See more and scroll to selected works"
      >
        <span>See More</span>

        <span
          className="animate-bounce text-lg motion-reduce:animate-none"
          aria-hidden="true"
        >
          ↓
        </span>
      </button>
    </section>
  );
}
