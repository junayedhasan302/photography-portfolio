
import Link from "next/link";

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <p className="mb-4 text-[10px] tracking-[0.3em] text-accent uppercase sm:mb-5 sm:text-xs">
            Behind the Lens
          </p>

          <h2
            id="about-heading"
            className="max-w-lg text-3xl leading-snug font-light tracking-tight sm:text-4xl lg:text-5xl"
          >
            Photography is how I see the world.
          </h2>
        </div>

        <div className="max-w-xl">
          <div className="space-y-5 sm:space-y-6">
            <p className="text-sm leading-7 text-muted sm:text-base sm:leading-8">
              Hi, I&apos;m Junayed — a photographer and visual storyteller who
              loves finding extraordinary stories in ordinary moments.
            </p>

            <p className="text-sm leading-7 text-muted sm:text-base sm:leading-8">
              From busy city streets to quiet landscapes, I try to capture
              authentic emotions, beautiful light, and the small details that
              make every moment unique.
            </p>

            <p className="text-sm leading-7 text-muted sm:text-base sm:leading-8">
              For me, photography is more than taking pictures. It&apos;s about
              preserving memories and sharing the way I experience the world.
            </p>
          </div>

          <Link
            href="#contact"
            className="group mt-7 inline-flex min-h-11 items-center gap-2 border-b border-accent pb-2 text-sm transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:mt-8"
          >
            Let&apos;s connect

            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              ↗
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
