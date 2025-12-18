
"use client";

import { useState, useMemo, useEffect } from "react";
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
import { PlusCircle, Edit, Trash2, Search, X, AlertCircle } from "lucide-react";
import type { Part, Brand, Category, VehicleCompatibility } from "@/lib/types";
import { useFirestore, useCollection, useMemoFirebase, FirestorePermissionError, errorEmitter } from "@/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories } from "@/lib/data";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const PARTS_PER_PAGE = 10;

type PartStatus = {
  isComplete: boolean;
  missingFields: string[];
};

const getPartStatus = (part: Part): PartStatus => {
  const missingFields: string[] = [];

  if (!part.name) missingFields.push("Nombre");
  if (!part.sku) missingFields.push("SKU");
  if (part.price <= 0) missingFields.push("Precio");
  if (!part.brandId) missingFields.push("Marca");
  if (!part.categoryIds || part.categoryIds.length === 0) missingFields.push("Categoría");
  if (!part.imageUrls || part.imageUrls.length === 0) missingFields.push("Imágenes");
  
  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
};

export default function ProductsTab() {
  const firestore = useFirestore();
  const partsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "parts");
  }, [firestore]);

  const brandsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'brands');
  }, [firestore]);

  const { data: parts, isLoading: partsLoading } = useCollection<Part>(partsCollection);
  const { data: brands, isLoading: brandsLoading } = useCollection<Brand>(brandsCollection);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | undefined>(undefined);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
      setCategories(getCategories());
  }, []);

  const { paginatedParts, totalPages } = useMemo(() => {
    if (!parts) return { paginatedParts: [], totalPages: 0 };
    
    let filtered = [...parts];

    if (searchQuery) {
        filtered = filtered.filter(part => 
            part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            part.sku.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (brandFilter !== 'all') {
        filtered = filtered.filter(part => part.brandId === brandFilter);
    }

    if (categoryFilter !== 'all') {
        filtered = filtered.filter(part => part.categoryIds && part.categoryIds.includes(categoryFilter));
    }

    if (statusFilter !== 'all') {
      const isCompleteFilter = statusFilter === 'complete';
      filtered = filtered.filter(part => getPartStatus(part).isComplete === isCompleteFilter);
    }

    const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
    
    const total = Math.ceil(sorted.length / PARTS_PER_PAGE);
    const paginated = sorted.slice((currentPage - 1) * PARTS_PER_PAGE, currentPage * PARTS_PER_PAGE);

    return { paginatedParts: paginated, totalPages: total };

  }, [parts, searchQuery, brandFilter, categoryFilter, statusFilter, currentPage]);


  const handleFormSubmit = async (data: any) => {
    if (!firestore || !partsCollection) return;

    const partData = {
        name: data.name,
        sku: data.sku,
        description: data.description || "",
        price: data.price,
        stock: data.stock,
        brandId: data.brandId,
        categoryIds: data.categoryIds || [],
        imageUrls: data.imageUrls || [],
        isFeatured: data.isFeatured,
        vehicleBrandIds: data.vehicleBrandIds || [],
        vehicleModelIds: data.vehicleModelIds || [],
        yearRange: data.yearRange || '',
        specifications: editingPart?.specifications || {}, 
        relatedPartIds: editingPart?.relatedPartIds || [],
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

  const clearFilters = () => {
    setSearchQuery("");
    setBrandFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  }

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

  const isLoading = partsLoading || brandsLoading;
  const hasActiveFilters = searchQuery !== "" || brandFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all";

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
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative md:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre o SKU..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                />
            </div>
            <Select value={brandFilter} onValueChange={handleFilterChange(setBrandFilter)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por marca" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {brands?.sort((a,b) => a.name.localeCompare(b.name)).map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={handleFilterChange(setCategoryFilter)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="complete">Completos</SelectItem>
                    <SelectItem value="incomplete">Incompletos</SelectItem>
                </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
              <div className="mb-4">
                <Button variant="ghost" onClick={clearFilters} className="text-sm">
                    <X className="w-4 h-4 mr-2" />
                    Limpiar {Object.values({searchQuery, brandFilter, categoryFilter, statusFilter}).filter(v => v && v !== 'all').length} filtro(s)
                </Button>
              </div>
            )}
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
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedParts.map((part) => {
                  const status = getPartStatus(part);
                  return (
                    <TableRow key={part.id}>
                      <TableCell>
                        {Array.isArray(part.imageUrls) && part.imageUrls.length > 0 && part.imageUrls[0] ? (
                          <Image
                            src={part.imageUrls[0]}
                            alt={part.name}
                            width={100}
                            height={100}
                            className="rounded-md object-cover h-auto"
                            data-ai-hint="auto part"
                          />
                        ) : (
                          <div className="h-[100px] w-[100px] bg-muted rounded-md flex items-center justify-center">
                             <AlertCircle className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell>{part.sku}</TableCell>
                      <TableCell>${part.price.toFixed(2)}</TableCell>
                      <TableCell>{part.stock}</TableCell>
                       <TableCell>
                          {status.isComplete ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">Completo</Badge>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 cursor-help">
                                  Incompleto
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-semibold">Faltan los siguientes campos:</p>
                                <ul className="list-disc pl-4 mt-1">
                                  {status.missingFields.map(field => <li key={field}>{field}</li>)}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          )}
                      </TableCell>
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
                  )
                })}
              </TableBody>
            </Table>
            </TooltipProvider>
            )}

            {totalPages > 1 && !isLoading && (
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
      </CardContent>
    </Card>
  );
}
