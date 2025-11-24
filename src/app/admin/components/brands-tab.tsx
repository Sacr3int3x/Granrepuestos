"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BrandForm } from "./brand-form";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import type { Brand } from "@/lib/types";
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function BrandsTab() {
  const firestore = useFirestore();
  const brandsCollection = useMemoFirebase(() => {
      if(!firestore) return null;
      return collection(firestore, "brands");
  }, [firestore]);

  const { data: brands, isLoading } = useCollection<Brand>(brandsCollection);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredAndSortedBrands = useMemo(() => {
    if (!brands) return [];
    
    const sorted = [...brands].sort((a, b) => a.name.localeCompare(b.name));

    if (!searchQuery) {
      return sorted;
    }

    return sorted.filter(brand => 
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  }, [brands, searchQuery]);

  const handleFormSubmit = async (data: Omit<Brand, 'id'> & { id?: string }) => {
    if (!firestore || !brandsCollection) return;
    
    const brandData = {
      name: data.name,
      logoUrl: data.logoUrl,
      description: data.description || "",
      countryOfOrigin: data.countryOfOrigin || "",
      heroImageUrl: data.heroImageUrl || "",
      websiteUrl: data.websiteUrl || "",
    };

    if (editingBrand && data.id) {
      const brandDoc = doc(firestore, "brands", data.id);
      updateDoc(brandDoc, brandData)
        .then(() => {
          toast({ title: "Marca actualizada", description: `"${data.name}" ha sido actualizada.` });
        })
        .catch(() => {
          const error = new FirestorePermissionError({
            path: brandDoc.path,
            operation: 'update',
            requestResourceData: brandData,
          });
          errorEmitter.emit('permission-error', error);
        });
    } else {
      addDoc(brandsCollection, brandData)
        .then(() => {
          toast({ title: "Marca creada", description: `"${data.name}" ha sido añadida.` });
        })
        .catch(() => {
          const error = new FirestorePermissionError({
            path: brandsCollection.path,
            operation: 'create',
            requestResourceData: brandData,
          });
          errorEmitter.emit('permission-error', error);
        });
    }
    
    setEditingBrand(undefined);
    setIsFormOpen(false);
  };

  const handleDelete = async (brandId: string) => {
    if (!firestore) return;
    
    const brandDoc = doc(firestore, "brands", brandId);
    deleteDoc(brandDoc)
      .then(() => {
        toast({ title: "Marca eliminada", variant: "destructive" });
      })
      .catch(() => {
        const error = new FirestorePermissionError({
          path: brandDoc.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', error);
      });
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setIsFormOpen(true);
  };
  
  const openNewDialog = () => {
    setEditingBrand(undefined);
    setIsFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestionar Marcas</CardTitle>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Marca
        </Button>
      </CardHeader>
      <CardContent>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingBrand ? "Editar Marca" : "Añadir Nueva Marca"}</DialogTitle>
                    <DialogDescription>
                    {editingBrand ? "Edita los detalles de la marca." : "Rellena los detalles para añadir una nueva marca."}
                    </DialogDescription>
                </DialogHeader>
                <BrandForm
                    key={editingBrand?.id}
                    onSubmit={handleFormSubmit}
                    brand={editingBrand}
                />
            </DialogContent>
        </Dialog>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre de marca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-24 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                        </div>
                    </div>
                ))}
            </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Logo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedBrands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    width={80}
                    height={40}
                    className="rounded-md object-contain h-10 w-auto"
                  />
                </TableCell>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(brand)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la marca.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(brand.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
