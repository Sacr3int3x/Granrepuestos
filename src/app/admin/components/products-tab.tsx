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
import { getParts } from "@/lib/data";
import { ProductForm } from "./product-form";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { Part } from "@/lib/types";

export default function ProductsTab() {
  // In a real app, this state would be managed via API calls and a state management library.
  const [parts, setParts] = useState(getParts());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | undefined>(undefined);
  const { toast } = useToast();

  const handleFormSubmit = (data: Part) => {
    if (editingPart) {
      // Update logic
      setParts(parts.map((p) => (p.id === data.id ? data : p)));
      toast({ title: "Repuesto actualizado", description: `"${data.name}" ha sido actualizado.` });
    } else {
      // Create logic
      const newPart = { ...data, id: `p${Date.now()}` };
      setParts([newPart, ...parts]);
      toast({ title: "Repuesto creado", description: `"${data.name}" ha sido añadido.` });
    }
    setEditingPart(undefined);
    setIsFormOpen(false);
  };

  const handleDelete = (partId: string) => {
    setParts(parts.filter((p) => p.id !== partId));
    toast({ title: "Repuesto eliminado", variant: "destructive" });
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
            {parts.map((part) => (
              <TableRow key={part.id}>
                <TableCell>
                  <Image
                    src={part.imageUrls[0]}
                    alt={part.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
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
      </CardContent>
    </Card>
  );
}
