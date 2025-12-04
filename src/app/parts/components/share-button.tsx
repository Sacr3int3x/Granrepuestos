
"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Part } from "@/lib/types";

interface ShareButtonProps {
  part: Part;
  size?: "default" | "sm" | "lg" | "icon" | null;
  className?: string;
}

export default function ShareButton({ part, size, className }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const shareUrl = `${window.location.origin}/parts/${part.id}`;
    const shareData = {
      title: `Repuesto: ${part.name}`,
      text: `Echa un vistazo a este repuesto: ${part.name}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error("Web Share API not supported");
      }
    } catch (err) {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "¡Enlace copiado!",
          description: "El enlace al repuesto ha sido copiado a tu portapapeles.",
        });
      } catch (copyErr) {
        toast({
          variant: "destructive",
          title: "Error al compartir",
          description: "No se pudo compartir o copiar el enlace.",
        });
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size={size || "icon"}
      onClick={handleShare}
      className={className}
      aria-label="Compartir repuesto"
    >
      <Share2 className="h-5 w-5" />
    </Button>
  );
}
