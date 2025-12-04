"use client";

import { Share2, Copy, Check } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ShareButtonProps extends ButtonProps {
  url: string;
  title?: string;
  text?: string;
}

export default function ShareButton({ url, title = "Mira este repuesto", text = "Encontré este repuesto y creo que podría interesarte.", ...props }: ShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (error) {
        console.error("Error al compartir:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast({
          title: "¡Enlace copiado!",
          description: "El enlace al producto ha sido copiado al portapapeles.",
        });
        setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
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
    <Button onClick={handleShare} aria-label="Compartir producto" {...props}>
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
    </Button>
  );
}
