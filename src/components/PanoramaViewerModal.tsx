import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize } from 'lucide-react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import '@photo-sphere-viewer/core/index.css';

interface PanoramaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  panoramaUrl: string;
}

export default function PanoramaViewerModal({ isOpen, onClose, panoramaUrl }: PanoramaViewerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg flex flex-col"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between p-4 sm:p-6 text-white absolute top-0 left-0 right-0 z-50 pointer-events-none">
            <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 pointer-events-auto">
              <Maximize className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold tracking-wider uppercase">360° Interactive View</span>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors pointer-events-auto border border-white/10"
              aria-label="Close panorama viewer"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Panorama Viewer Container */}
          <div className="flex-1 w-full h-full relative cursor-move">
            <ReactPhotoSphereViewer
              src={panoramaUrl}
              height="100%"
              width="100%"
              littlePlanet={false}
              hideNavbarButton={false}
            />
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-50">
            <div className="bg-black/50 backdrop-blur-md text-white/80 text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border border-white/10">
              Drag to look around • Scroll to zoom
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
