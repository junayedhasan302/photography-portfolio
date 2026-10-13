
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { photos } from "@/data/photos";

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
    <main className="min-h-screen bg-[#10110f] px-5 py-10 text-[#f4f0e8] sm:px-8 sm:py-14 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/gallery"
          className="text-sm text-white/60 transition hover:text-white"
        >
          ← Back to Gallery
        </Link>

        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start lg:gap-12">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-white/5">
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
            <p className="text-xs uppercase tracking-[0.25em] text-[#b9a887]">
              {photo.category}
            </p>

            <h1 className="mt-4 text-3xl font-light sm:text-4xl lg:text-5xl">
              {photo.title}
            </h1>

            <div className="my-6 h-px w-16 bg-[#b9a887]" />

            <p className="text-sm leading-7 text-white/65">
              {photo.description || "The story behind this photograph is coming soon."}
            </p>

            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Photograph Details
              </p>

              <p className="mt-3 text-sm text-white/60">
                Photo ID: {photo.id}
              </p>

              <p className="mt-2 text-sm text-white/60">
                Category: {photo.category}
              </p>
            </div>

            <Link
              href="/gallery"
              className="mt-8 inline-block border border-white/20 px-5 py-3 text-sm transition hover:border-[#b9a887] hover:text-[#b9a887]"
            >
              Explore More Photos
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
