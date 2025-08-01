import {
  useEffect,
  useRef,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { RefObject } from "react";
import { debounce } from "lodash";

export const useObserver = (
  containerRef: RefObject<HTMLUListElement | null>,
  itemsCount: number | undefined,
  visible: Set<number>,
  setVisible: Dispatch<SetStateAction<Set<number>>>
) => {
  const imgRefs = useRef<(HTMLLIElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          setVisible((prevVisible) => {
            const newList = new Set<number>(prevVisible);

            entries.forEach((entry) => {
              const index = Number(entry.target.getAttribute("data-index"));
              if (entry.isIntersecting) {
                newList.add(index);
              } else {
                newList.delete(index);
              }
            });

            return new Set(newList);
          });
        },
        {
          root: containerRef.current,
          threshold: 0.5,
        }
      );
    }
  }, [containerRef, setVisible]);

  const performObservation = useMemo(() => {
    return () => {
      if (!observerRef.current) return;

      imgRefs.current.forEach((ref) => {
        if (ref) {
          observerRef.current!.unobserve(ref);
          observerRef.current!.observe(ref);
        }
      });
    };
  }, []);

  const debouncedObservation = useMemo(
    () => debounce(performObservation, 150),
    [performObservation]
  );

  useEffect(() => {
    const observer = observerRef.current;
    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", debouncedObservation);
    }

    const handleResize = () => {
      performObservation();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      debouncedObservation.cancel();

      if (container) {
        container.removeEventListener("scroll", debouncedObservation);
      }
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (itemsCount !== undefined) {
      performObservation();
    }
  }, [itemsCount, performObservation]);

  return [imgRefs];
};
