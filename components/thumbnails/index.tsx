"use client";
import { type RefCallback, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";

import { useEffect, useState, useRef } from "react";
import { useObserver } from "@/lib/use-observer";
import { fetchImage } from "@/lib/fetch-image";

interface DataType {
  items: string[];
  token: string | null;
}

interface Props {
  visible: Set<number>;
  setVisible: Dispatch<SetStateAction<Set<number>>>;
}

export const Thumbnails = ({ visible, setVisible }: Props) => {
  const containerRef = useRef<HTMLUListElement>(null);
  // const [data, setData] = useState<DataType | null>(null);
  const [images, setImages] = useState<string[] | null>(null);
  const [imgRefs /* , visibleItems */] = useObserver(
    containerRef,
    images?.length,
    visible,
    setVisible
  );

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch("/api/items").then(
        (res) => res.json() as Promise<DataType>
      );
      await fetchImage(response.items, "thumbnail")
        .then((images) => {
          setImages(images);
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
      // console.log(">>response", response, images);
      // setData(response)
    }

    fetchItems();
  }, []);

  const setRef: RefCallback<HTMLLIElement> = (el) => {
    if (el && imgRefs && "current" in imgRefs && imgRefs.current) {
      // console.log(el)
      const index = Number(el.getAttribute("data-index"));
      imgRefs.current[index] = el;
    }
  };

  return (
    <ul
      className="flex flex-col gap-2 min-h-[200px] max-h-[400px] overflow-hidden overflow-y-auto"
      ref={containerRef}
    >
      {!images ||
        (images?.length === 0 && (
          <li className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
            No images available
          </li>
        ))}
      {images &&
        images?.map((url, index) => (
          <li
            className="relative aspect-[600/400]"
            key={`thumbnail-${index}-${url}`}
            ref={setRef}
            data-index={index}
          >
            <Image
              unoptimized
              fill
              className="w-full h-auto object-cover"
              src={url}
              alt={url}
              loading="lazy"
            />
          </li>
        ))}
    </ul>
  );
};
