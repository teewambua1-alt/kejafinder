import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Share2, Home, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { KejaListing } from '../types/listings';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import PanoramaViewerModal from './PanoramaViewerModal';
import { View } from 'lucide-react';
import { useModalA11y } from '../hooks/useModalA11y';

interface ListingImageGalleryProps {
  listing: KejaListing;
  onSaveToggle?: () => void;
  onShare?: () => void;
  isSaved?: boolean;
}

export default function ListingImageGallery({ listing, onSaveToggle, onShare, isSaved = false }: ListingImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);
  const lightboxRef = useModalA11y(isLightboxOpen, () => setIsLightboxOpen(false));

  const images = listing.images && listing.images.length > 0 ? listing.images : (listing.imageUrl ? [listing.imageUrl] : []);

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-neutral-100 dark:bg-stone-850 rounded-3xl border border-neutral-200/50 dark:border-stone-800/40 shadow-sm flex flex-col items-center justify-center p-6 text-neutral-400 dark:text-stone-500">
        <div className="w-16 h-16 rounded-full bg-white dark:bg-stone-800 shadow-sm flex items-center justify-center mb-3">
          <Home className="w-8 h-8 stroke-[1.5]" />
        </div>
        <p className="font-semibold text-sm">Photos coming soon</p>
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col w-full"
      >
        {/* Main Image Container */}
        <div 
          className="relative w-full h-72 xs:h-80 sm:h-96 rounded-3xl overflow-hidden shadow-sm bg-neutral-100 dark:bg-stone-900 border border-neutral-200/40 dark:border-stone-800/40 group cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImageIndex}
              src={images[activeImageIndex]}
              alt={`${listing.title} main photo`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Counter Badge */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wider">
            {activeImageIndex + 1} / {images.length}
          </div>

          {/* 360 Panorama Button */}
          {listing.panoramaUrl && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsPanoramaOpen(true);
              }}
              className="absolute bottom-4 right-4 bg-emerald-500/90 hover:bg-emerald-600 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 transition-colors border border-emerald-400/20"
            >
              <View className="w-4 h-4" />
              <span>360° View</span>
            </motion.button>
          )}

          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            {onShare && (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={onShare}
                className="w-10 h-10 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/5 flex items-center justify-center text-neutral-700 dark:text-stone-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer outline-none"
                aria-label="Share listing"
              >
                <Share2 className="w-4.5 h-4.5 stroke-[2]" />
              </motion.button>
            )}

            {onSaveToggle && (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={onSaveToggle}
                className={`w-10 h-10 rounded-full backdrop-blur-md shadow-sm border border-black/5 dark:border-white/5 flex items-center justify-center transition-colors cursor-pointer outline-none ${
                  isSaved 
                    ? 'bg-rose-50/90 dark:bg-rose-900/80 text-rose-500' 
                    : 'bg-white/90 dark:bg-stone-900/90 text-neutral-500 hover:text-rose-400'
                }`}
                aria-label="Save listing"
              >
                <motion.div
                  animate={isSaved ? { scale: [1, 1.25, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-4.5 h-4.5 stroke-[2.2] ${isSaved ? 'fill-rose-500' : ''}`} />
                </motion.div>
              </motion.button>
            )}
          </div>
        </div>

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="flex items-center space-x-3 mt-4 overflow-x-auto pb-2 scrollbar-none px-1">
            {images.map((img, idx) => {
              const isActive = idx === activeImageIndex;
              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View photo ${idx + 1} of ${listing.title}`}
                  className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden shadow-xs outline-none cursor-pointer border-2 transition-all duration-200 ${
                    isActive 
                      ? 'border-emerald-500 scale-100 ring-2 ring-emerald-500/20' 
                      : 'border-transparent opacity-60 hover:opacity-100 scale-95'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  {isActive && (
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            ref={lightboxRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`${listing.title} photo gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg flex flex-col outline-none"
          >
            {/* Header / Controls */}
            <div className="flex items-center justify-between p-4 sm:p-6 text-white absolute top-0 left-0 right-0 z-50">
              <div className="text-xs font-medium tracking-wider uppercase bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                {activeImageIndex + 1} / {images.length}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Image Viewer */}
            <div className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden">
              <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={4}
                centerOnInit
                doubleClick={{ disabled: false, mode: 'toggle' }}
                wheel={{ step: 0.1 }}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                    <motion.img
                      key={activeImageIndex}
                      src={images[activeImageIndex]}
                      alt={`${listing.title} fullscreen`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="max-w-full max-h-[85vh] object-contain select-none"
                    />
                  </TransformComponent>
                )}
              </TransformWrapper>

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-colors z-50 border border-white/10"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNext}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-colors z-50 border border-white/10"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </>
              )}
            </div>
            
            {/* Thumbnail Navigation inside Lightbox */}
            {images.length > 1 && (
               <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center px-4 z-50 pointer-events-none">
                 <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-2 scrollbar-none pointer-events-auto bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                   {images.map((img, idx) => (
                     <button
                       key={idx}
                       onClick={() => setActiveImageIndex(idx)}
                       className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-lg overflow-hidden transition-all duration-200 outline-none ${
                         idx === activeImageIndex 
                           ? 'ring-2 ring-emerald-500 scale-100 opacity-100' 
                           : 'opacity-40 hover:opacity-100 scale-95'
                       }`}
                     >
                       <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                     </button>
                   ))}
                 </div>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 360 Panorama Modal */}
      {listing.panoramaUrl && (
        <PanoramaViewerModal
          isOpen={isPanoramaOpen}
          onClose={() => setIsPanoramaOpen(false)}
          panoramaUrl={listing.panoramaUrl}
        />
      )}
    </>
  );
}
