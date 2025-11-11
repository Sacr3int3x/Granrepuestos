"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";

export default function Header() {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/parts", label: "Repuestos" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            GranRepuestos
          </span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/" className="flex items-center space-x-2">
                  <Icons.logo className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">GranRepuestos</span>
                </Link>
                <nav className="grid gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === item.href
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
