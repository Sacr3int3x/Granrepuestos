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
                cloudName={CLOUDINARY_CLOUD_NAME}
                uploadPreset={CLOUDINARY_UPLOAD_PRESET}
                signatureEndpoint="/api/sign-cloudinary-params"
                onSuccess={onUpload}
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