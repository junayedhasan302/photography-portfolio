import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:px-12 lg:py-32">
      <div>
        <p className="mb-5 text-xs tracking-[0.3em] text-[#b9a887] uppercase">
          Photographer & Visual Storyteller
        </p>

        <h1 className="max-w-xl text-5xl leading-tight font-light tracking-tight sm:text-6xl lg:text-7xl">
          Stories, seen differently.
        </h1>

        <p className="mt-6 max-w-md text-sm leading-7 text-white/60 sm:text-base">
          Capturing meaningful moments, everyday beauty, and stories hidden in
          the ordinary world.
        </p>

        <Link
          href="#work"
          className="mt-8 inline-block border border-white/25 px-6 py-3 text-sm transition hover:bg-white hover:text-black"
        >
          Explore My Work
        </Link>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <Image
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
          alt="Mountain landscape photographed during golden hour"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
