import { Icons } from "@/components/icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icons.logo className="h-8 w-10 text-primary" />
          <p className="leading-loose hidden sm:block">
            &copy; {new Date().getFullYear()} GranRepuestos. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex gap-4 text-sm">
           <Link href="/politicas" className="text-muted-foreground hover:text-primary hover:underline">
            Políticas
          </Link>
        </div>
      </div>
    </footer>
  );
}
