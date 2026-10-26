
import Image from "next/image";
import Link from "next/link";
import { albums } from "@/data/albums";

export default function AlbumsSection() {
  return (
    <section id="albums">
      <div
        id="albums-flash"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mb-10 max-w-xl sm:mb-14">
          <p className="mb-3 text-[10px] tracking-[0.3em] text-accent uppercase sm:text-xs">
            Explore Collections
          </p>

          <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
            Stories in Albums
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-muted">
            A collection of moments, places, and people worth remembering.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-7">
          {albums.map((album) => (
            <article key={album.id} className="group min-w-0">
              <Link
                href={`/albums/${album.id}`}
                aria-label={`Explore ${album.title} album`}
                className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface-hover">
                  <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10"
                  />

                  <span className="absolute right-4 bottom-4 translate-y-2 rounded-sm bg-background/90 px-3 py-2 text-xs text-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Explore ↗
                  </span>
                </div>
              </Link>

              <div className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium tracking-tight transition-colors duration-300 group-hover:text-accent">
                      <Link
                        href={`/albums/${album.id}`}
                        className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      >
                        {album.title}
                      </Link>
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-muted">
                      {album.description}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-sm text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                  >
                    ↗
                  </span>
                </div>

                <p className="mt-3 text-[11px] tracking-wide text-accent">
                  {album.photoCount} Photographs
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
