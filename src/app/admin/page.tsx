"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsTab from "./components/products-tab";
import BrandsTab from "./components/brands-tab";
import { Button } from '@/components/ui/button';
import { Package, Tags, LogOut } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[200px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Bienvenido, {user.email}. Gestiona los repuestos y marcas de la tienda.
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="products">
            <Package className="mr-2 h-4 w-4" />
            Repuestos
          </TabsTrigger>
          <TabsTrigger value="brands">
            <Tags className="mr-2 h-4 w-4" />
            Marcas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="brands">
          <BrandsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
