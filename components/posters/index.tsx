import Image from "next/image";

import { useEffect, useState } from "react";
import { fetchImage } from "@/lib/fetch-image";

interface Props {
  visibleItems: number[];
}

export const Posters = ({ visibleItems }: Props) => {
  const [images, setImages] = useState<string[] | null>(null);

  useEffect(() => {
    async function fetchPosters(visibleItems: number[]) {
      await fetchImage(visibleItems, "poster")
        .then((images) => {
          setImages(images);
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
    }

    fetchPosters(visibleItems);
  }, [visibleItems]);

  return (
    <ul className="grid grid-cols-3 gap-2">
      {(!images || images?.length === 0) && (
        <li className="relative aspect-[600/400] flex items-center justify-center bg-gray-200 text-xs">
          No images available
        </li>
      )}
      {images?.map((url, index) => (
        <li
          className="relative aspect-[600/400]"
          key={`poster-${index}-${url}`}
        >
          {url ? (
            <Image
              unoptimized
              fill
              className="w-full h-auto object-cover"
              src={url}
              alt={url}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
              Image failed to load
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
