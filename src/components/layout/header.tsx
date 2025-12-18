
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingCart, Mail, MessageSquare, Search } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { useCart } from "@/context/cart-context";
import { Input } from "../ui/input";

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

function HeaderSearch() {
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;
    if (query) {
      router.push(`/parts?query=${encodeURIComponent(query)}`);
    } else {
      router.push('/parts');
    }
  };

  return (
     <form onSubmit={handleSearch} className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          name="query"
          placeholder="Busca por nombre, código..."
          className="h-10 pl-10 pr-4 text-sm rounded-md"
        />
      </form>
  );
}


export default function Header() {
  const pathname = usePathname();
  const { cartItemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
  
  const navItems = [
    { href: "/parts", label: "Repuestos" },
    { href: "/brands", label: "Marcas" },
    { href: "/quienes-somos", label: "Quiénes Somos" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;
    setIsSearchSheetOpen(false); // Close sheet on search
    const router = (event.currentTarget as HTMLFormElement).ownerDocument.defaultView?.history;
    if (query) {
      window.location.href = `/parts?query=${encodeURIComponent(query)}`;
    } else {
      window.location.href = '/parts';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-12 w-20 text-primary" />
            <span className="sr-only">GranRepuestos</span>
          </Link>
           <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
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
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-2">
          {/* Desktop Search */}
          <Sheet open={isSearchSheetOpen} onOpenChange={setIsSearchSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Abrir búsqueda">
                    <Search className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="top" className="p-0">
                <div className="container mx-auto py-12">
                   <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                        name="query"
                        placeholder="Busca por nombre, SKU o marca..."
                        className="h-14 pl-12 pr-4 text-lg rounded-lg"
                        autoFocus
                        />
                    </form>
                </div>
            </SheetContent>
          </Sheet>

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
                <div className="px-1 mt-4">
                  <HeaderSearch />
                </div>
                <nav className="grid gap-4 mt-4">
                  {navItems.map((item) => (
                     <NavLink key={item.href} href={item.href} onClick={handleLinkClick}>
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
                 <div className="mt-auto flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground px-1">Contáctanos:</p>
                   <Button asChild variant="outline">
                     <a href="https://wa.me/584120177075" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
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
