import React, { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

const ImageZoom = ({ src, alt, className = "" }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    if (isZoomed) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevent scrolling when zoomed
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isZoomed]);

  return (
    <>
      {/* The Triggering Image */}
      <div 
        className={`relative overflow-hidden cursor-zoom-in group rounded-xl ${className}`}
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white shadow-lg">
            <ZoomIn size={24} />
          </div>
        </div>
      </div>

      {/* The Zoom Portal (Modal) */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={() => setIsZoomed(false)}
          >
            <X size={32} />
          </button>
          
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-300"
          />
        </div>
      )}
    </>
  );
};

export default ImageZoom;