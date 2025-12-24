
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingCart, Mail, MessageSquare, Search, Euro } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { useCart } from "@/context/cart-context";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";

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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          name="query"
          placeholder="Busca por nombre, código..."
          className="h-11 pl-11 pr-4 text-base rounded-lg border-2"
        />
      </form>
  );
}

function ExchangeRateManager() {
  const { exchangeRate, setExchangeRate } = useCart();
  const [localRate, setLocalRate] = useState(exchangeRate.toString());

  useEffect(() => {
    // Sync local state if context changes from another component
    setLocalRate(exchangeRate > 0 ? exchangeRate.toString() : '');
  }, [exchangeRate]);

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid number format
    if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setLocalRate(value);
    }
  };

  const handleRateUpdate = () => {
    const newRate = parseFloat(localRate.replace(',', '.'));
    if (!isNaN(newRate) && newRate > 0) {
      setExchangeRate(newRate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Euro className="mr-2 h-4 w-4" />
          Tasa BCV
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Tasa de Cambio</h4>
            <p className="text-sm text-muted-foreground">
              Introduce la tasa EUR a VES del día.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="exchange-rate">Tasa € ➜ Bs.</Label>
            <Input
              id="exchange-rate"
              value={localRate}
              onChange={handleRateChange}
              onBlur={handleRateUpdate}
              placeholder="Ej: 40.5"
              className="h-8"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}


export default function Header() {
  const pathname = usePathname();
  const { cartItemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { href: "/parts", label: "Repuestos" },
    { href: "/brands", label: "Marcas" },
    { href: "/quienes-somos", label: "Quiénes Somos" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
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
           <nav className="hidden items-center gap-4 text-sm font-medium lg:flex">
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
        <div className="flex flex-1 items-center justify-end gap-2">
          <ExchangeRateManager />
          {/* Desktop Search */}
          <div className="hidden md:block w-full max-w-sm">
            <HeaderSearch />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
               <SheetHeader className="border-b pb-4">
                  <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                  <Link href="/" onClick={handleLinkClick} className="flex items-center space-x-2">
                    <Icons.logo className="h-12 w-24 text-primary" />
                    <span className="sr-only">GranRepuestos</span>
                  </Link>
               </SheetHeader>
              <div className="flex flex-col gap-6 pt-6 h-full">
                <div className="px-1">
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
                      <a href="mailto:soporte@granrepuestos.com" onClick={handleLinkClick}>
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
