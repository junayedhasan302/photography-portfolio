
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { photos } from "@/data/photos";
import Navbar from "@/components/Navbar";

type PhotoDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PhotoDetailsPage({
  params,
}: PhotoDetailsPageProps) {
  const { id } = await params;

  const photo = photos.find((item) => item.id === Number(id));

  if (!photo) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Back Navigation */}
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <span aria-hidden="true">←</span>
            Back to Gallery
          </Link>

          {/* Photo Details */}
          <div className="mt-8 grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-start lg:mt-12 lg:gap-16">
            {/* Image */}
            <div>
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-sm bg-surface-hover sm:min-h-[400px] md:min-h-[520px]">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  width={1600}
                  height={1200}
                  priority
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="h-auto max-h-[75vh] w-full object-contain"
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-muted">
                A photograph from the {photo.category} collection.
              </p>
            </div>

            {/* Information */}
            <div className="py-2 md:sticky md:top-28">
              <p className="text-[10px] tracking-[0.3em] text-accent uppercase sm:text-xs">
                {photo.category}
              </p>

              <h1 className="mt-4 text-3xl leading-tight font-light tracking-tight sm:text-4xl lg:text-5xl">
                {photo.title}
              </h1>

              <div
                aria-hidden="true"
                className="my-6 h-px w-16 bg-accent"
              />

              <p className="max-w-xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
                {photo.description ||
                  "The story behind this photograph is coming soon."}
              </p>

              {/* Metadata */}
              <div className="mt-10 border-t border-border pt-6">
                <p className="text-[10px] tracking-[0.25em] text-muted uppercase sm:text-xs">
                  Photograph Details
                </p>

                <dl className="mt-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-muted">Photo ID</dt>
                    <dd className="text-sm text-foreground">{photo.id}</dd>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-muted">Collection</dt>
                    <dd className="text-right text-sm text-foreground">
                      {photo.category}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-5 py-3 text-sm text-background transition-opacity duration-300 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Explore More Photos
                  <span aria-hidden="true">↗</span>
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-sm border border-border px-5 py-3 text-sm transition-colors duration-300 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
