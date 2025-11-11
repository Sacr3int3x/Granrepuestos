import { Icons } from "@/components/icons";
import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo className="h-6 w-6 text-primary" />
          <div className="flex flex-col md:flex-row items-center gap-2 text-center text-sm text-muted-foreground md:text-left">
            <p className="leading-loose">
              &copy; {new Date().getFullYear()} GranRepuestos. Todos los derechos reservados.
            </p>
            <Link href="/admin" className="text-xs hover:underline">Admin</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" aria-label="Twitter">
            <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="#" aria-label="Facebook">
            <Facebook className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="#" aria-label="Instagram">
            <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
