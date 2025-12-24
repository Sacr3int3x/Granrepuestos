'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { CheckoutForm, type PaymentFormValues } from './components/checkout-form';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CreditCard, Loader2 } from 'lucide-react';
import type { PaymentReport } from '@/lib/types';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, exchangeRate } = useCart();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If cart is empty after initialization, redirect to the parts catalog.
    if (cartItems.length === 0 && typeof window !== 'undefined') {
      router.replace('/parts');
    }
  }, [cartItems, router]);


  const handleSubmitPayment = async (data: PaymentFormValues) => {
    if (!firestore || cartItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo procesar el reporte. El carrito está vacío o la base de datos no está disponible.',
      });
      return;
    }

    setIsSubmitting(true);

    const reportData: Omit<PaymentReport, 'id'> = {
      customerEmail: data.customerEmail,
      items: cartItems.map((item) => ({
        partId: item.part.id,
        name: item.part.name,
        price: item.part.price,
        quantity: item.quantity,
      })),
      totalAmount: cartTotal,
      status: 'pending_verification',
      createdAt: serverTimestamp(),
      paymentDetails: {
        referenceNumber: data.referenceNumber,
        bank: data.bank,
        phone: data.phone,
        idNumber: data.idNumber,
        amount: data.amount,
        paymentDate: format(data.paymentDate, 'yyyy-MM-dd'),
      },
    };

    try {
      const reportsCollection = collection(firestore, 'paymentReports');
      const docRef = await addDoc(reportsCollection, reportData);
      toast({
        title: '¡Reporte de Pago Recibido!',
        description: `Tu reporte #${docRef.id.slice(0, 6)} ha sido registrado. Lo verificaremos pronto.`,
      });
      clearCart();
      router.push(`/`);
    } catch (error) {
      console.error("Error submitting payment report: ", error);
      toast({
        variant: 'destructive',
        title: 'Error al enviar reporte',
        description: 'Hubo un problema al registrar tu pago. Por favor, intenta de nuevo o contacta a soporte.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (cartItems.length === 0) {
      return (
         <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Tu carrito está vacío, redirigiendo...</p>
        </div>
      );
  }


  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Finalizar Compra</h1>
        <p className="text-muted-foreground mt-2">Revisa tu orden y reporta tu pago para completarla.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="order-2 lg:order-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard />
                Reportar Pago
              </CardTitle>
              <CardDescription>Completa este formulario después de realizar tu Pago Móvil.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Icons.logo className="h-6 w-6 text-blue-600" />
                <AlertTitle className="text-blue-800">Datos para Pago Móvil</AlertTitle>
                <AlertDescription className="text-blue-700 space-y-1 mt-2">
                  <p>
                    <strong>Banco:</strong> Bancaribe (0114)
                  </p>
                  <p>
                    <strong>Teléfono:</strong> 0412-3269600
                  </p>
                  <p>
                    <strong>Cédula/RIF:</strong> J-30176436-3
                  </p>
                  <p>
                    <strong>Nombre:</strong> Granrepuestos Express C.A
                  </p>
                </AlertDescription>
              </Alert>
              <CheckoutForm onSubmit={handleSubmitPayment} totalAmount={cartTotal} isLoading={isSubmitting} />
            </CardContent>
          </Card>
        </div>

        <div className="order-1 lg:order-2">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Resumen de la Orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.part.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image src={item.part.imageUrls[0]} alt={item.part.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">{item.part.name}</p>
                      <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">€{(item.part.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-lg">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total a Pagar</span>
                  <span className="text-primary">€{cartTotal.toFixed(2)}</span>
                </div>
                {exchangeRate > 0 && (
                  <div className="flex justify-between text-muted-foreground text-base pt-1 border-t">
                    <span>Aprox. Bs.</span>
                    <span>{(cartTotal * exchangeRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-muted-foreground" asChild>
                <a href="https://wa.me/584120177075" target="_blank" rel="noopener noreferrer">
                  ¿Necesitas ayuda? Contacta por WhatsApp
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
