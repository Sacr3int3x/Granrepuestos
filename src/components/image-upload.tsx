"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { ImagePlus, Trash2 } from "lucide-react";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}

// IMPORTANT: You need to create an "unsigned" upload preset in your Cloudinary account
// and name it exactly "gran_repuestos_preset".
// Also, set your cloud name in the component below.
const CLOUDINARY_CLOUD_NAME = "dx413fa7v"; // <-- REEMPLAZA ESTO
const CLOUDINARY_UPLOAD_PRESET = "gran_repuestos_preset"; // <-- Nombre del preset de carga


const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    onRemove,
    value
}) => {

    const onUpload = useCallback((result: any) => {
        onChange(result.info.secure_url)
    }, [onChange]);

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
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
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget 
                onSuccess={onUpload} 
                uploadPreset={CLOUDINARY_UPLOAD_PRESET}
                options={{
                    cloudName: CLOUDINARY_CLOUD_NAME,
                    maxFiles: 5, // Puedes ajustar el número máximo de archivos
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }
                    return (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Subir una Imagen
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;
