"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { useAuth } from "@/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthErrorCodes,
} from "firebase/auth";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo válido." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function getFirebaseAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case AuthErrorCodes.INVALID_EMAIL:
        return "El formato del correo electrónico no es válido.";
      case AuthErrorCodes.USER_DELETED:
        return "El usuario no ha sido encontrado.";
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
        return "Credenciales incorrectas. Por favor, revisa tu correo y contraseña.";
      case AuthErrorCodes.EMAIL_EXISTS:
        return "Este correo electrónico ya está en uso. Intenta iniciar sesión.";
      case AuthErrorCodes.WEAK_PASSWORD:
        return "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
      default:
        return "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({
          title: "Inicio de Sesión Exitoso",
          description: "Redirigiendo al panel de administración...",
        });
      } else {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        toast({
          title: "¡Cuenta Creada!",
          description: "Redirigiendo al panel de administración...",
        });
      }
      router.push("/admin");
    } catch (error: any) {
      console.error("Authentication Error:", error);
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: getFirebaseAuthErrorMessage(error.code),
      });
    } finally {
      setIsLoading(false);
    }
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    form.reset();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="mx-auto max-w-sm w-full shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Icons.logo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">
            {authMode === "login" ? "Admin Login" : "Crear Cuenta"}
          </CardTitle>
          <CardDescription>
            {authMode === "login"
              ? "Accede al panel de administración de GranRepuestos."
              : "Crea una nueva cuenta de administrador."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Procesando..."
                  : authMode === "login"
                  ? "Iniciar Sesión"
                  : "Crear Cuenta"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {authMode === "login" ? (
              <>
                ¿No tienes una cuenta?{" "}
                <button onClick={toggleAuthMode} className="underline text-primary">
                  Crear cuenta
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{" "}
                <button onClick={toggleAuthMode} className="underline text-primary">
                  Iniciar sesión
                </button>
              </>
            )}
            <div className="my-2"></div>
            <Link
              href="/"
              className="underline text-muted-foreground hover:text-primary"
            >
              Volver a la tienda
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
