"use client";
import { useState, useMemo } from "react";

import { Posters } from "@/components/posters";
import { Thumbnails } from "@/components/thumbnails";

export default function Home() {
  const [visible, setVisible] = useState(new Set<number>());

  const sortedVisible = useMemo(
    () => [...visible].sort((a, b) => a - b),
    [visible]
  );

  return (
    <div>
      <h1 className="font-black text-3xl">Our Layout</h1>
      <main className="flex gap-2 w-full">
        <section className="flex-[80%] grow-1">
          <Posters visibleItems={sortedVisible} />
        </section>
        <aside className="flex-[20%]">
          <Thumbnails visible={visible} setVisible={setVisible} />
        </aside>
      </main>
    </div>
  );
}
