import { Icons } from "@/components/icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex items-center justify-center py-6">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground md:flex-row md:gap-4">
          <Icons.logo className="h-6 w-6 text-primary" />
          <p className="leading-loose">
            &copy; {new Date().getFullYear()} GranRepuestos. Todos los derechos reservados.
          </p>
          <Link href="/admin" className="text-xs hover:underline">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

    