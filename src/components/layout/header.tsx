"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, Mail, MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { useCart } from "@/context/cart-context";

export default function Header() {
  const pathname = usePathname();
  const { cartItemCount, setIsCartOpen } = useCart();
  
  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/parts", label: "Repuestos" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.logo className="h-12 w-12 text-primary" />
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
           <div className="hidden md:flex items-center gap-2">
             <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Contactar por WhatsApp"
            >
               <a href="https://wa.me/584141123707" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-5 w-5" />
              </a>
            </Button>
             <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Contactar por correo"
            >
              <a href="mailto:info@granrepuestos.com">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex relative"
            aria-label="Abrir carrito"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                {cartItemCount}
              </span>
            )}
          </Button>

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
               <SheetHeader className="sr-only">
                  <SheetTitle>Menú de navegación</SheetTitle>
               </SheetHeader>
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/" className="flex items-center space-x-2">
                  <Icons.logo className="h-10 w-10 text-primary" />
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
