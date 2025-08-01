"use client";
import {
  type RefCallback,
  type Dispatch,
  type SetStateAction,
  useCallback,
} from "react";
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
  const isLoading = useRef(false);
  const tokenRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLUListElement>(null);
  const [images, setImages] = useState<string[] | null>(null);
  const handleLoading = useCallback(async (token?: string | null) => {
    await fetch(`/api/items${token ? `?continuation=${token}` : ""}`)
      .then((res) => res.json() as Promise<DataType>)
      .then((response) => {
        if (!response || !response.items || response.items.length === 0) {
          console.warn("No items returned from API");
          return;
        }
        console.log("Fetched items:", response.items);
        return fetchImage(response.items, "thumbnail")
          .then((images) => {
            setImages((prevImages) => {
              const newImages = [...(prevImages || []), ...images];
              return newImages;
            });
            tokenRef.current = response.token;
          })
          .catch((error) => {
            console.error("Error fetching images:", error);
          })
          .finally(() => {
            isLoading.current = false;
            console.log("Loading complete, current token:", response.token);
          });
      });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isLoading.current || !tokenRef.current) return;
    isLoading.current = true;
    handleLoading(tokenRef.current);
  }, [handleLoading]);

  const [imgRefs /* , visibleItems */] = useObserver(
    containerRef,
    images?.length,
    setVisible,
    handleLoadMore
  );

  useEffect(() => {
    handleLoading();
  }, []);

  const setRef: RefCallback<HTMLLIElement> = (el) => {
    if (el && imgRefs && "current" in imgRefs && imgRefs.current) {
      if (el.getAttribute("data-index") === "LOAD_MORE") {
        imgRefs.current.push(el);
        return;
      }
      const index = Number(el.getAttribute("data-index"));
      imgRefs.current[index] = el;
    }
  };

  return (
    <ul
      className="flex flex-col gap-2 min-h-[200px] max-h-[400px] overflow-hidden overflow-y-auto"
      ref={containerRef}
    >
      {!isLoading.current && (!images || images?.length === 0) && (
        <li className="relative aspect-[600/400] flex items-center justify-center bg-gray-200 text-xs">
          No images available
        </li>
      )}
      {images &&
        images?.map((url, index) => (
          <li
            className="relative aspect-[600/400]"
            key={`thumbnail-${index}-${url}`}
            ref={setRef}
            data-index={index + 1}
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
      {tokenRef.current && (
        <li
          data-index={"LOAD_MORE"}
          ref={setRef}
          className="relative aspect-[600/400] flex items-center justify-center bg-gray-200 animate-pulse text-xs"
        >
          Loading...
        </li>
      )}
    </ul>
  );
};
