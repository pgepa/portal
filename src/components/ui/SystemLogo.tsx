import { useState, useEffect } from "react";
import defaultLogo from "@/assets/logo.svg";

interface SystemLogoProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

/**
 * Componente robusto para exibir logos dos sistemas, com suporte a:
 * - URLs externas sem bloqueio de hotlink (referrerPolicy="no-referrer")
 * - Imagens em formato Data URL (Base64)
 * - Assets internos importados
 * - Fallback automático caso a imagem falhe ou não exista
 */
export function SystemLogo({
  src,
  alt,
  className = "w-full h-full object-contain",
  fallback = defaultLogo,
}: SystemLogoProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(() => (src && src.trim() ? src.trim() : fallback));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const cleaned = src && typeof src === "string" ? src.trim() : "";
    if (cleaned) {
      setCurrentSrc(cleaned);
      setHasError(false);
    } else {
      setCurrentSrc(fallback);
      setHasError(false);
    }
  }, [src, fallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      key={currentSrc}
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
}
