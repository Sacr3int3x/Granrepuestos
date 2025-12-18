
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setIsCopied(true);
      toast({
        title: '¡Enlace copiado!',
        description: 'Ya puedes compartir el enlace del repuesto.',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo copiar el enlace.',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: fullUrl,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          // This is expected if the user cancels the share sheet.
          // We don't need to log it as an error or do anything.
        } else {
          // For other errors, fallback to clipboard
          copyToClipboard();
        }
      }
    } else {
        // Fallback for browsers that don't support navigator.share
        copyToClipboard();
    }
  };

  return (
    <Button variant="outline" onClick={handleShare}>
      {isCopied ? (
         <Check className="mr-2 h-4 w-4 text-green-500" />
      ) : (
         <Share2 className="mr-2 h-4 w-4" />
      )}
     
      {isCopied ? 'Copiado' : 'Compartir'}
    </Button>
  );
};

export default ShareButton;
