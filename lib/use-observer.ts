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
  setVisible: Dispatch<SetStateAction<Set<number>>>,
  handleLoadMore: () => void
) => {
  const imgRefs = useRef<(HTMLLIElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pendingChanges = useRef<Map<number, boolean>>(new Map());

  const debouncedSetVisible = useMemo(
    () =>
      debounce(() => {
        if (pendingChanges.current.size > 0) {
          setVisible((prevVisible) => {
            const newList = new Set<number>(prevVisible);

            pendingChanges.current.forEach((isVisible, index) => {
              if (isVisible) {
                newList.add(index);
              } else {
                newList.delete(index);
              }
            });

            pendingChanges.current.clear();
            return newList;
          });
        }
      }, 150),
    [setVisible]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // console.log("IntersectionObserver entries:", entries);

          entries.forEach((entry) => {
            const isLoadMore =
              entry.target.getAttribute("data-index") === "LOAD_MORE";
            if (isLoadMore) {
              if (entry.isIntersecting) {
                if (typeof handleLoadMore === "function") {
                  handleLoadMore();
                }
              }
              return;
            }

            const index = Number(entry.target.getAttribute("data-index"));
            // Add to map, so we pull the latest value
            pendingChanges.current.set(index, entry.isIntersecting);
          });

          debouncedSetVisible();
        },
        {
          root: containerRef.current,
          threshold: 0.5,
        }
      );
    }
  }, [containerRef, setVisible, handleLoadMore]);

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
      debouncedSetVisible.cancel();

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
