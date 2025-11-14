"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}

// =================================================================================
// INSTRUCCIONES IMPORTANTES DE CLOUDINARY
// 1. Inicia sesión en tu cuenta de Cloudinary: https://cloudinary.com/console
// 2. Ve a Settings (icono de engranaje) > pestaña Upload.
// 3. Busca la sección "Upload Presets" y haz clic en "Add upload preset".
// 4. Cambia el "Signing Mode" de "Signed" a "Unsigned".
// 5. Dale el nombre "granrepuesto" al preset y guárdalo.
// =================================================================================
const CLOUDINARY_CLOUD_NAME = "dx413fa7v";
const CLOUDINARY_UPLOAD_PRESET = "granrepuesto";

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    onRemove,
    value
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);

        const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Cloudinary upload error response:", errorData);
                    throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
                }

                const data = await response.json();
                if (data.secure_url) {
                    return data.secure_url;
                } else {
                    console.error("Cloudinary upload failed: secure_url not found in response", data);
                    return null;
                }
            } catch (error) {
                console.error("Error uploading to Cloudinary:", error);
                return null;
            }
        });

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            uploadedUrls.forEach(url => {
                if (url) {
                    onChange(url);
                }
            });
        } finally {
            setIsUploading(false);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Imagen del repuesto"
                            src={url}
                            sizes="200px"
                        />
                    </div>
                ))}
                 {isUploading && (
                    <div className="w-[200px] h-[200px] rounded-md bg-muted flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>
            
            <input 
                type="file" 
                accept="image/*"
                multiple
                ref={fileInputRef} 
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />
            <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
            >
                <ImagePlus className="h-4 w-4 mr-2" />
                Subir Imagen(es)
            </Button>
        </div>
    )
}

export default ImageUpload;
