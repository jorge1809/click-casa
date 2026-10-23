import { useState } from "react";
import { ImageOff } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function ImagenConFallback({ src, alt, className }: Props) {
  const [fallida, setFallida] = useState(false);

  return fallida || !src ? (
    <div
      className={className}
      role="img"
      aria-label={alt || "Imagen no disponible"}
      style={{
        display: "grid",
        placeItems: "center",
        background: "#f0f1f2",
        color: "#969ba3",
        minHeight: 160,
      }}
    >
      <ImageOff size={32} strokeWidth={1.5} />
    </div>
  ) : (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFallida(true)}
    />
  );
}
