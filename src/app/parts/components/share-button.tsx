"use client";

import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
}

export default function ShareButton({ url, title = "Mira este repuesto", text = "Encontré este repuesto y creo que podría interesarte." }: ShareButtonProps) {
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
        // Ignore AbortError which is triggered when the user cancels the share dialog
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
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
    <Button onClick={handleShare} size="icon" variant="ghost" aria-label="Compartir producto">
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
    </Button>
  );
}