// components/shared/ui/ImageWithLoader/ImageWithLoader.tsx
import { useState } from 'react';
import styles from './ImageWithLoader.module.css';

interface Props {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean; // если true — грузим сразу
}

const ImageWithLoader = ({ src, alt, className = '', priority = false }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`${styles.imageContainer} ${className}`}>
      {isLoading && (
        <div className={styles.imageSkeleton}>
          <div className={styles.skeletonPulse} />
        </div>
      )}
      <img
        src={hasError ? '/placeholder.png' : src}
        alt={alt}
        className={`${styles.image} ${isLoading ? styles.hidden : ''}`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          setHasError(true);
          setIsLoading(false);
          e.currentTarget.onerror = null;
        }}
        width={50} 
        height={50}
      />
    </div>
  );
};

export default ImageWithLoader;
