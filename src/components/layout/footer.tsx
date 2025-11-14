import { Icons } from "@/components/icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col items-center justify-center py-4 gap-2">
        <div className="flex items-center gap-2 text-center text-sm text-muted-foreground">
          <Icons.logo className="h-8 w-10 text-primary" />
          <p className="leading-loose">
            &copy; {new Date().getFullYear()} GranRepuestos. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex gap-4 text-xs">
           <Link href="/politicas" className="text-muted-foreground hover:text-primary hover:underline">
            Políticas de Compra
          </Link>
           <Link href="/admin" className="text-muted-foreground hover:text-primary hover:underline">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
