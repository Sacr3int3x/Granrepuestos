
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
    if (!isUserLoading) {
      if (!user) {
        // If there's no user, just redirect to login
        router.push('/login');
      } else if (user.isAnonymous) {
        // If the user is anonymous, sign them out and then redirect.
        // This prevents the admin login from being affected by the anonymous session.
        signOut(auth).then(() => {
          router.push('/login');
        });
      }
      // If the user is not anonymous, we assume they are an admin or trying to be.
      // The security rules on the backend will be the ultimate gatekeeper.
    }
  }, [user, isUserLoading, router, auth]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    // After logout, always redirect to the login page
    router.push('/login');
  };

  // Show a loading skeleton while checking for the user's auth state.
  if (isUserLoading || !user || user.isAnonymous) {
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2 mx-auto" />
          <div className="flex justify-center gap-4 mt-4">
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
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline text-center">
          Panel de Administración
        </h1>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto">
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

      <div className="mt-12 flex justify-center">
         <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
      </div>
    </div>
  );
}
