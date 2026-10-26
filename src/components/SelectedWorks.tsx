
import Image from "next/image";
import Link from "next/link";
import { featuredPhotos } from "@/data/photos";

export default function SelectedWorks() {
  return (
    <section
      id="work"
      aria-labelledby="selected-works-heading"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-32 pb-20 sm:px-8 sm:pt-36 sm:pb-28 lg:px-12 lg:pt-40"
    >
      <div className="mb-10 flex items-end justify-between gap-4 sm:mb-12">
        <div>
          <p className="mb-3 text-[10px] tracking-[0.3em] text-accent uppercase sm:text-xs">
            A Few Favorites
          </p>

          <h2
            id="selected-works-heading"
            className="text-3xl font-light tracking-tight sm:text-4xl"
          >
            Selected Works
          </h2>
        </div>

        <p className="hidden text-sm text-muted md:block">
          Moments worth remembering.
        </p>

        <Link
          href="/gallery"
          className="shrink-0 border-b border-transparent pb-1 text-xs tracking-wide text-accent transition-colors duration-300 hover:border-accent hover:text-accent-hover focus-visible:border-accent focus-visible:outline-none sm:text-sm"
        >
          View All Photos <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-6">
        {featuredPhotos.map((photo, index) => (
          <article
            key={photo.id}
            className={`group min-w-0 ${
              index === 0 ? "sm:col-span-2 lg:col-span-2" : ""
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface">
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 640px) 100vw, 50vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </div>

            <div className="mt-4 sm:mt-5">
              <h3 className="text-base font-medium leading-snug tracking-tight transition-colors duration-300 group-hover:text-accent">
                {photo.title}
              </h3>

              <p className="mt-1.5 text-xs leading-relaxed tracking-wide text-muted">
                {photo.category}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
