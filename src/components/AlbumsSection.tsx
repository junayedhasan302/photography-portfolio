
import Image from "next/image";
import Link from "next/link";
import { albums } from "@/data/albums";

export default function AlbumsSection() {
  return (
    <section className="border-y border-border bg-surface">
      <div
        id="albums"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mb-10 max-w-xl">
          <p className="mb-3 text-xs tracking-[0.3em] text-accent uppercase">
            Explore Collections
          </p>

          <h2 className="text-3xl font-light sm:text-4xl">
            Stories in Albums
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted">
            A collection of moments, places, and people worth remembering.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <article key={album.id} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface-hover">
                <Image
                  src={album.cover}
                  alt={album.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex items-start justify-between gap-4 pt-4">
                <div>
                  <h3 className="text-lg font-medium">{album.title}</h3>

                  <p className="mt-1 text-sm text-muted">
                    {album.description}
                  </p>

                  <p className="mt-3 text-xs text-accent">
                    {album.photoCount} Photographs
                  </p>
                </div>

                <Link
                  href={`/albums/${album.id}`}
                  aria-label={`Explore ${album.title} album`}
                  className="mt-1 shrink-0 text-sm text-muted transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Explore ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
