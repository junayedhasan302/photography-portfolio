
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
        <div className="mx-auto max-w-6xl">
          <Link
            href="/gallery"
            className="text-sm text-muted transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            ← Back to Gallery
          </Link>

          <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start lg:gap-12">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-hover">
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>

            <div className="py-2">
              <p className="text-xs tracking-[0.25em] text-accent uppercase">
                {photo.category}
              </p>

              <h1 className="mt-4 text-3xl font-light sm:text-4xl lg:text-5xl">
                {photo.title}
              </h1>

              <div className="my-6 h-px w-16 bg-accent" />

              <p className="text-sm leading-7 text-muted">
                {photo.description ||
                  "The story behind this photograph is coming soon."}
              </p>

              <div className="mt-10 border-t border-border pt-6">
                <p className="text-xs tracking-[0.2em] text-muted uppercase">
                  Photograph Details
                </p>

                <p className="mt-3 text-sm text-muted">
                  Photo ID: {photo.id}
                </p>

                <p className="mt-2 text-sm text-muted">
                  Category: {photo.category}
                </p>
              </div>

              <Link
                href="/gallery"
                className="mt-8 inline-block rounded-sm border border-border px-5 py-3 text-sm transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Explore More Photos
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
