"use client";

import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps extends React.ComponentProps<typeof Button> {
  url: string;
  title?: string;
  text?: string;
}

export default function ShareButton({ url, title = "Mira este repuesto", text = "Encontré este repuesto y creo que podría interesarte.", className, ...props }: ShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: fullUrl,
        });
      } catch (error) {
        // Handle AbortError, which occurs when the user cancels the share action
        if (error instanceof Error && error.name === 'AbortError') {
          // Do nothing, as this is an expected user action.
          return;
        }
        console.error("Error al compartir:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        toast({
          title: "¡Enlace copiado!",
          description: "El enlace al producto ha sido copiado al portapapeles.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error al copiar el enlace:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo copiar el enlace.",
        });
      }
    }
  };

  return (
    <Button onClick={handleShare} aria-label="Compartir producto" className={cn(className)} {...props}>
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
    </Button>
  );
}
