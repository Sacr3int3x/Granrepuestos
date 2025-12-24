
import { Suspense } from 'react';
import { Metadata } from 'next';
import PartsPageClient from './page.client';

export const metadata: Metadata = {
    title: "Catálogo de Repuestos para Carros | GranRepuestos",
    description: "Explora nuestro catálogo completo de repuestos para carros en Venezuela. Filtra por marca, categoría y vehículo para encontrar la pieza que necesitas.",
};

export default function PartsPage() {
  return (
    <Suspense fallback={<div className="bg-white"><div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">Cargando...</div></div>}>
      <PartsPageClient />
    </Suspense>
  )
}
