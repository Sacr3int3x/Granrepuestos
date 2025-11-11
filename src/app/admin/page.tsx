import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsTab from "./components/products-tab";
import BrandsTab from "./components/brands-tab";
import { Package, Tags } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground">
          Gestiona los repuestos y marcas de la tienda.
        </p>
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
