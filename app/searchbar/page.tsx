"use client";

import { Loader2 } from "lucide-react";

import {
  useState,
  useEffect,
  useRef,
  type MouseEventHandler,
  type ChangeEventHandler,
  type FocusEventHandler,
} from "react";

const mockResults = [
  "Hello World",
  "Hello Next.js",
  "Hello Vercel",
  "Hello AI",
  "Hello ChatGPT",
  "Hello OpenAI",
  "Hello JavaScript",
];

const fetchSearchResults = async (query: string): Promise<string[]> => {
  if (query.trim() === "") {
    return [];
  }

  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.results;
};

type LoadingState = "idle" | "loading" | "error";

export default function SearchBarPage() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<LoadingState>("idle");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value;
    setQuery(value);
  };

  const handleOnFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    setShowResults("idle");
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      console.log("Mouse down event:", e.target);
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as any)) {
        setShowResults("idle");
      }
    };
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    console.log("Search query:", query);
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    setShowResults("loading");

    fetchSearchResults(query)
      .then(setResults)
      .catch(() => {
        console.error("Error fetching search results");
        setShowResults("error");
        setResults([]);
      })
      .finally(() => {
        setShowResults("idle");
      });
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto border" ref={wrapperRef}>
      <input
        value={query}
        type="text"
        placeholder="Search..."
        className="w-full p-2"
        onChange={handleOnChange}
        onFocus={handleOnFocus}
      />
      {showResults === "loading" && (
        <Loader2 className="absolute right-2 top-2 size-4 animate-spin" />
      )}
      {showResults !== "loading" && query.length > 0 && (
        <div className="absolute z-10 w-full border border-t-0 -mt-1 bg-yellow-200 p-2">
          {results.length === 0 && <p>No results found</p>}
          {results.length > 0 && (
            <ul>
              {results.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
