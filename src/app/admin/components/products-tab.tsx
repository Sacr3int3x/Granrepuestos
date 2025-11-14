
"use client";

import { useState } from "react";
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
  DialogTrigger,
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
import { ProductForm } from "./product-form";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { Part, VehicleCompatibility } from "@/lib/types";
import { useFirestore, useCollection, useMemoFirebase, FirestorePermissionError, errorEmitter } from "@/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsTab() {
  const firestore = useFirestore();
  const partsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "parts");
  }, [firestore]);

  const { data: parts, isLoading } = useCollection<Part>(partsCollection);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | undefined>(undefined);
  const { toast } = useToast();

  const handleFormSubmit = async (data: Omit<Part, 'id' | 'specifications' | 'relatedPartIds' | 'vehicleCompatibility'> & { id?: string, vehicleCompatibility?: string, imageUrls?: string[] }) => {
    if (!firestore || !partsCollection) return;
    
    let vehicleCompatibility: VehicleCompatibility[] = [];
    if (data.vehicleBrandId && data.vehicleModelIds && data.vehicleModelIds.length > 0 && data.vehicleCompatibility) {
        data.vehicleModelIds.forEach(modelId => {
            vehicleCompatibility.push({
                brandId: data.vehicleBrandId as string,
                modelId: modelId,
                yearRange: data.vehicleCompatibility as string,
            });
        });
    }

    const partData = {
        name: data.name,
        sku: data.sku,
        description: data.description,
        price: data.price,
        stock: data.stock,
        brandId: data.brandId,
        categoryId: data.categoryId,
        imageUrls: data.imageUrls || [],
        isFeatured: data.isFeatured,
        vehicleBrandId: data.vehicleBrandId,
        vehicleModelIds: data.vehicleModelIds,
        specifications: editingPart?.specifications || {}, 
        relatedPartIds: editingPart?.relatedPartIds || [],
        vehicleCompatibility: vehicleCompatibility,
    };

    if (editingPart && data.id) {
      const partDoc = doc(firestore, "parts", data.id);
      updateDoc(partDoc, partData)
        .then(() => {
          toast({ title: "Repuesto actualizado", description: `"${data.name}" ha sido actualizado.` });
        })
        .catch(() => {
            const error = new FirestorePermissionError({ path: partDoc.path, operation: 'update', requestResourceData: partData });
            errorEmitter.emit('permission-error', error);
        });
    } else {
      addDoc(partsCollection, partData)
        .then(() => {
          toast({ title: "Repuesto creado", description: `"${data.name}" ha sido añadido.` });
        })
        .catch(() => {
            const error = new FirestorePermissionError({ path: partsCollection.path, operation: 'create', requestResourceData: partData });
            errorEmitter.emit('permission-error', error);
        });
    }
    setEditingPart(undefined);
    setIsFormOpen(false);
  };

  const handleDelete = (partId: string) => {
    if (!firestore) return;
    const partDoc = doc(firestore, "parts", partId);
    deleteDoc(partDoc).then(() => {
        toast({ title: "Repuesto eliminado", variant: "destructive" });
    }).catch(() => {
        const error = new FirestorePermissionError({ path: partDoc.path, operation: 'delete' });
        errorEmitter.emit('permission-error', error);
    })
  };

  const openEditDialog = (part: Part) => {
    setEditingPart(part);
    setIsFormOpen(true);
  };

  const openNewDialog = () => {
    setEditingPart(undefined);
    setIsFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestionar Repuestos</CardTitle>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Repuesto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingPart ? "Editar Repuesto" : "Añadir Nuevo Repuesto"}</DialogTitle>
              <DialogDescription>
                {editingPart ? "Edita los detalles del repuesto." : "Rellena los detalles para añadir un nuevo repuesto."}
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              key={editingPart?.id} // Rerender form when product changes
              onSubmit={handleFormSubmit}
              part={editingPart}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-4 w-2/5" />
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-4 w-1/5" />
                    </div>
                ))}
            </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts?.map((part) => (
              <TableRow key={part.id}>
                <TableCell>
                  {Array.isArray(part.imageUrls) && part.imageUrls.length > 0 && part.imageUrls[0] ? (
                    <Image
                      src={part.imageUrls[0]}
                      alt={part.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover h-auto"
                      data-ai-hint="auto part"
                    />
                  ) : (
                    <div className="h-[60px] w-[60px] bg-muted rounded-md" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{part.name}</TableCell>
                <TableCell>{part.sku}</TableCell>
                <TableCell>${part.price.toFixed(2)}</TableCell>
                <TableCell>{part.stock}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(part)}>
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el repuesto.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(part.id)}
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

    