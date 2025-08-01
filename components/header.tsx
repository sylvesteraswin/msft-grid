"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { pages, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const pathname = usePathname();
  return (
    <header className="bg-primary">
      <nav className="max-w-3xl p-3 mx-auto">
        <ul className="flex gap-2">
          {pages.map(({ label, href }, index) => (
            <li key={`${label}-${index}`}>
              <Button
                asChild
                variant={"ghost"}
                className={cn(pathname === href && "bg-secondary")}
              >
                <Link href={href}>{label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
