"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { useCart } from "@/context/cart-context";

const NavLink = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick: () => void }) => {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        "text-lg font-medium transition-colors hover:text-primary",
        pathname === href ? "text-foreground" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};


export default function Header() {
  const pathname = usePathname();
  const { cartItemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { href: "/parts", label: "Repuestos" },
    { href: "/brands", label: "Marcas" },
    { href: "/quienes-somos", label: "Quiénes Somos" },
    { href: "/politicas", label: "Políticas" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left & Center Section (Desktop Navigation with Logo) */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-12 w-20 text-primary" />
            <span className="sr-only">GranRepuestos</span>
          </Link>
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Inicio
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname.startsWith(item.href)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Logo */}
         <Link href="/" className="flex items-center space-x-2 md:hidden">
          <Icons.logo className="h-12 w-20 text-primary" />
          <span className="sr-only sm:inline-block font-bold font-headline">
            GranRepuestos
          </span>
        </Link>


        {/* Right Section */}
        <div className="flex items-center justify-end gap-2">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
              <div className="flex flex-col gap-6 pt-6 h-full">
                <Link href="/" onClick={handleLinkClick} className="flex items-center space-x-2">
                  <Icons.logo className="h-10 w-10 text-primary" />
                  <span className="font-bold font-headline">GranRepuestos</span>
                </Link>
                <nav className="grid gap-4">
                     <NavLink href="/" onClick={handleLinkClick}>
                      Inicio
                    </NavLink>
                  {navItems.map((item) => (
                     <NavLink key={item.href} href={item.href} onClick={handleLinkClick}>
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
                 <div className="mt-auto flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground px-1">Contáctanos:</p>
                   <Button asChild variant="outline">
                     <a href="https://wa.me/584141123707" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                        <MessageSquare className="mr-2" /> WhatsApp
                      </a>
                   </Button>
                    <Button asChild variant="outline">
                      <a href="mailto:info@granrepuestos.com" onClick={handleLinkClick}>
                        <Mail className="mr-2" /> Correo
                      </a>
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
