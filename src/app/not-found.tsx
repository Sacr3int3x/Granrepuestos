import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-background text-center px-4">
        <div className="flex flex-col items-center">
          <SearchX className="h-24 w-24 text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Página No Encontrada
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mb-8">
            Lo sentimos, no pudimos encontrar la página que estás buscando. Puede que haya sido eliminada o que la URL sea incorrecta.
          </p>
          <Button asChild size="lg">
            <Link href="/parts">Volver al Catálogo</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
