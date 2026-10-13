import Link from "next/link";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <p className="mb-4 text-xs tracking-[0.3em] text-[#b9a887] uppercase">
            Behind the Lens
          </p>

          <h2 className="max-w-lg text-3xl leading-snug font-light sm:text-4xl lg:text-5xl">
            Photography is how I see the world.
          </h2>
        </div>

        <div className="max-w-xl">
          <p className="text-sm leading-8 text-muted sm:text-base">
            Hi, I&apos;m Junayed — a photographer and visual storyteller who
            loves finding extraordinary stories in ordinary moments.
          </p>

          <p className="text-sm leading-8 text-muted sm:text-base">
            From busy city streets to quiet landscapes, I try to capture
            authentic emotions, beautiful light, and the small details that make
            every moment unique.
          </p>

          <p className="text-sm leading-8 text-muted sm:text-base">
            For me, photography is more than taking pictures. It&apos;s about
            preserving memories and sharing the way I experience the world.
          </p>

          <Link
            href="#contact"
            className="mt-8 inline-block border-b border-[#b9a887] pb-2 text-sm transition hover:text-[#b9a887]"
          >
            Let&apos;s connect ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
