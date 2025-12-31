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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";

const BRANDS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { paginatedBrands, totalPages } = useMemo(() => {
    if (!brands) return { paginatedBrands: [], totalPages: 0 };
    
    const sorted = [...brands].sort((a, b) => a.name.localeCompare(b.name));

    const filtered = searchQuery
      ? sorted.filter(brand => 
          brand.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : sorted;

    const total = Math.ceil(filtered.length / BRANDS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * BRANDS_PER_PAGE, currentPage * BRANDS_PER_PAGE);

    return { paginatedBrands: paginated, totalPages: total };

  }, [brands, searchQuery, currentPage]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const generatePagination = () => {
        if (totalPages <= 1) return [];

        const SIBLING_COUNT = 1;
        const totalPageNumbers = SIBLING_COUNT + 5;

        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - SIBLING_COUNT, 1);
        const rightSiblingIndex = Math.min(currentPage + SIBLING_COUNT, totalPages);
        
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * SIBLING_COUNT;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, '...', totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * SIBLING_COUNT;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, '...', ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }
        return [];
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
                    {editingBrand ? "Edita los detalles de la marca para actualizarla en la base de datos." : "Rellena los detalles para añadir una nueva marca al catálogo."}
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page on new search
              }}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                        <Skeleton className="h-10 w-20 rounded-md" />
                         <Skeleton className="h-4 w-3/5" />
                    </div>
                ))}
            </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Logo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBrands.map((brand) => (
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
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la marca de la base de datos.
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
            {totalPages > 1 && (
               <div className="mt-8">
                 <Pagination>
                   <PaginationContent>
                     <PaginationItem>
                       <PaginationPrevious
                         onClick={() => handlePageChange(currentPage - 1)}
                         aria-disabled={currentPage <= 1}
                         className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
                       />
                     </PaginationItem>
                     {generatePagination().map((pageNumber, index) => (
                       <PaginationItem key={index}>
                         {typeof pageNumber === 'string' ? (
                           <PaginationEllipsis />
                         ) : (
                           <PaginationLink
                             onClick={() => handlePageChange(pageNumber)}
                             isActive={currentPage === pageNumber}
                           >
                             {pageNumber}
                           </PaginationLink>
                         )}
                       </PaginationItem>
                     ))}
                     <PaginationItem>
                       <PaginationNext
                         onClick={() => handlePageChange(currentPage + 1)}
                         aria-disabled={currentPage >= totalPages}
                         className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
                       />
                     </PaginationItem>
                   </PaginationContent>
                 </Pagination>
               </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}