
import Link from "next/link";
import { notFound } from "next/navigation";
import { albums } from "@/data/albums";
import { photos } from "@/data/photos";
import AlbumGallery from "@/components/AlbumGallery";

type AlbumPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AlbumDetailsPage({
  params,
}: AlbumPageProps) {
  const { id } = await params;

  const album = albums.find((item) => item.id === Number(id));

  if (!album) {
    notFound();
  }

  const albumPhotos = photos.filter((photo) =>
    album.photoIds.includes(photo.id),
  );

  return (
    <main className="min-h-screen bg-[#10110f] px-5 py-12 text-[#f4f0e8] sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Back to Home */}
        <Link
          href="/"
          className="text-sm text-white/60 transition hover:text-white"
        >
          ← Back to Home
        </Link>

        {/* Album Heading */}
        <div className="mt-10 mb-10">
          <p className="mb-3 text-xs tracking-[0.3em] text-[#b9a887] uppercase">
            Photography Album
          </p>

          <h1 className="text-4xl font-light sm:text-5xl">
            {album.title}
          </h1>

          <p className="mt-4 text-sm text-white/50">
            {album.description}
          </p>

          <p className="mt-3 text-xs text-[#b9a887]">
            {albumPhotos.length} Photographs
          </p>
        </div>

        {/* Album Gallery */}
        <AlbumGallery photos={albumPhotos} />
      </div>
    </main>
  );
}
