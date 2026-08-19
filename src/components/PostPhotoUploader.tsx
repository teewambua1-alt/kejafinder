import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { 
  Image as ImageIcon, 
  UploadCloud, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Camera,
  Grid,
  Check,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PostListingPreview from './PostListingPreview';
import { PostListingDraft } from '../types/postListing';

export type PostPhotoPreview = {
  id: string;
  file: File;
  previewUrl: string;
  label?: string;
  isCover?: boolean; // We treat the first photo in the array as the cover image.
};

interface PostPhotoUploaderProps {
  photos: PostPhotoPreview[];
  onPhotosChange: (photos: PostPhotoPreview[]) => void;
  error?: string;
  draft: PostListingDraft;
}

const SLOT_LABELS = [
  'Room',
  'Outside',
  'Toilet',
  'Kitchen',
  'Compound',
  'Photo',
  'Photo',
  'Photo'
];

export default function PostPhotoUploader({
  photos,
  onPhotosChange,
  error,
  draft,
}: PostPhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localNote, setLocalNote] = useState<string | null>(null);

  const MAX_PHOTOS = 8;
  const MAX_SIZE_MB = 10;

  const validateAndAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setLocalNote(null);
    const addedPreviews: PostPhotoPreview[] = [];
    let ignoredCountSize = 0;
    let ignoredCountType = 0;
    let spaceLeft = MAX_PHOTOS - photos.length;

    if (spaceLeft <= 0) {
      setLocalNote(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }

    // Accept types
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    Array.from(files).forEach((file) => {
      if (spaceLeft <= 0) return;

      if (!validTypes.includes(file.type)) {
        ignoredCountType++;
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        ignoredCountSize++;
        return;
      }

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);
      
      addedPreviews.push({
        id,
        file,
        previewUrl,
      });
      spaceLeft--;
    });

    if (files.length > (MAX_PHOTOS - photos.length)) {
      setLocalNote(`You can add up to ${MAX_PHOTOS} photos.`);
    } else if (ignoredCountSize > 0 && ignoredCountType > 0) {
      setLocalNote(`Some photos were skipped due to size (>10MB) and format requirements.`);
    } else if (ignoredCountSize > 0) {
      setLocalNote(`Some photos exceeded the ${MAX_SIZE_MB}MB size limit and were skipped.`);
    } else if (ignoredCountType > 0) {
      setLocalNote(`Only JPG, PNG and WEBP file types are supported.`);
    }

    if (addedPreviews.length > 0) {
      onPhotosChange([...photos, ...addedPreviews]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(e.target.files);
    e.target.value = ''; // Allow uploading same file again
  };

  const removePhoto = (id: string, url: string) => {
    URL.revokeObjectURL(url);
    const updated = photos.filter((p) => p.id !== id);
    onPhotosChange(updated);
    setLocalNote(null);
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const target = photos[index];
    const otherPhotos = photos.filter((_, idx) => idx !== index);
    const updated = [target, ...otherPhotos];
    onPhotosChange(updated);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Recommended photo items checklist
  const checklistItems = [
    'Room photo',
    'Outside building',
    'Toilet / bathroom',
    'Kitchen / cooking area',
    'Compound / gate',
  ];

  // Logic to determine photo count guidance type
  const getGuidanceDetails = () => {
    const count = photos.length;
    if (count === 0) {
      return {
        text: 'Add at least one real photo to continue.',
        type: 'warning',
        icon: AlertTriangle,
        colorClass: 'bg-amber-500/5 text-amber-700 dark:text-amber-500 border-amber-500/10'
      };
    } else if (count <= 2) {
      return {
        text: 'More photos can help tenants trust your listing.',
        type: 'warning',
        icon: AlertTriangle,
        colorClass: 'bg-amber-500/5 text-amber-700 dark:text-amber-500 border-amber-500/10'
      };
    } else {
      return {
        text: 'Good photo coverage.',
        type: 'success',
        icon: CheckCircle2,
        colorClass: 'bg-emerald-550/5 text-emerald-800 dark:text-emerald-400 border-emerald-500/15'
      };
    }
  };

  const guidance = getGuidanceDetails();
  const GuidanceIcon = guidance.icon;

  return (
    <div className="flex flex-col space-y-5">
      
      {/* 1. Main Photos Header & Drag-Drop Card */}
      <div className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Camera className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col space-y-0.5">
            <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
              Add Photos
            </h3>
            <p className="text-[10px] font-semibold text-neutral-400 dark:text-stone-500">
              Clear photos help tenants trust your listing faster.
            </p>
          </div>
        </div>

        {/* Hidden inputs to support programmatic clicks */}
        <input 
          ref={fileInputRef}
          type="file" 
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp" 
          className="hidden"
          onChange={handleFileInputChange}
          aria-hidden="true"
        />

        {/* 2. Drag & Drop Upload Zone */}
        {photos.length < MAX_PHOTOS ? (
          <button
            type="button"
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full cursor-pointer text-left rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-6 transition-all duration-300 focus:outline-hidden ${
              isDragging 
                ? 'border-emerald-500 bg-emerald-500/5 shadow-inner' 
                : 'border-emerald-500/20 dark:border-emerald-500/10 hover:border-emerald-500/40 bg-white/40 dark:bg-stone-850/40'
            }`}
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isDragging ? 'bg-emerald-500 text-white animate-bounce' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            } mb-3`}>
              <UploadCloud className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            
            <h4 className="text-[12px] font-extrabold text-neutral-800 dark:text-stone-200 tracking-tight">
              Upload house photos
            </h4>
            <p className="text-[9.5px] font-semibold text-neutral-400 dark:text-stone-500 max-w-[220px] mt-1.5 leading-relaxed">
              Add room, outside, toilet, kitchen, and compound photos.
            </p>
            <span className="text-[8px] font-bold text-neutral-550 dark:text-stone-600 uppercase tracking-widest mt-2 bg-neutral-100 dark:bg-stone-800 py-1 px-2.5 rounded-full select-none">
              JPG or PNG, up to 10MB each
            </span>
          </button>
        ) : (
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 flex flex-col items-center text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">All photos added</h4>
            <p className="text-[10px] font-medium text-emerald-700/80 dark:text-emerald-500/80 leading-relaxed max-w-[210px]">
              You have added the maximum limit of {MAX_PHOTOS} photos. Remove some if you want to swap them.
            </p>
          </div>
        )}

        {/* Errors & Local Notes banner alerts */}
        {error && (
          <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex items-start space-x-2 text-red-650 dark:text-red-400 animate-pulse">
            <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.2] mt-0.5" />
            <span className="text-[10.5px] font-extrabold leading-tight">{error}</span>
          </div>
        )}

        {localNote && (
          <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-start space-x-2 text-amber-750 dark:text-amber-500">
            <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.2] mt-0.5" />
            <span className="text-[10.5px] font-extrabold leading-tight">{localNote}</span>
          </div>
        )}
      </div>

      {/* 2. Photo count / Quality guidance section */}
      <div className={`p-3.5 border rounded-2xl flex items-center justify-between shadow-3xs transition-all ${guidance.colorClass}`}>
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-current/5 shrink-0">
            <GuidanceIcon className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <p className="text-[11px] font-bold leading-tight">
            {guidance.text}
          </p>
        </div>
        <div className="text-[11px] font-mono font-black shrink-0 px-2 py-0.5 bg-neutral-100/10 rounded-md select-none border border-current/10">
          {photos.length} / {MAX_PHOTOS} Photos
        </div>
      </div>

      {/* 3. Uploaded photo grid with empty slots (exactly 8 slots) */}
      <div className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-3.5">
        <h4 className="text-xs font-black text-neutral-700 dark:text-stone-300 tracking-tight">
          Photo Placement Grid
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {Array.from({ length: MAX_PHOTOS }).map((_, index) => {
              const photo = photos[index];
              const label = SLOT_LABELS[index];

              if (photo) {
                // Uploaded thumbnail slot
                return (
                  <motion.div
                    key={photo.id}
                    layoutId={`thumb-card-${photo.id}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-100 dark:border-stone-800 group shadow-xs"
                  >
                    {/* Rendered housing image */}
                    <img 
                      src={photo.previewUrl} 
                      alt={`House upload ${index + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay darken layer */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-85 transition-opacity pointer-events-none" />

                    {/* Labels badge */}
                    <div className="absolute bottom-2 left-2 flex flex-col items-start gap-1">
                      {index === 0 ? (
                        <span className="flex items-center space-x-0.5 bg-emerald-600 border border-emerald-500/20 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black tracking-wide uppercase shadow-3xs">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Cover / Room</span>
                        </span>
                      ) : (
                        <span className="bg-stone-900/80 backdrop-blur-md text-stone-200 border border-white/5 px-1.5 py-0.5 rounded-md text-[8.5px] font-extrabold tracking-tight">
                          {label}
                        </span>
                      )}
                    </div>

                    {/* Set as Cover action for elements index > 0 */}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(index)}
                        className="absolute bottom-2 right-2 flex items-center justify-center bg-white/95 text-stone-900 hover:bg-neutral-50 px-1.5 py-1 rounded-lg text-[8.5px] font-black tracking-tight cursor-pointer shadow-sm border border-neutral-200"
                      >
                        Set cover
                      </button>
                    )}

                    {/* Absolute Delete element */}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id, photo.previewUrl)}
                      aria-label="Remove photo"
                      className="absolute top-2 right-2 w-6.5 h-6.5 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center cursor-pointer border border-white/10 shadow-sm transition-colors"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </motion.div>
                );
              } else {
                // Empty action slots
                return (
                  <button
                    key={`slot-empty-${index}`}
                    type="button"
                    onClick={triggerFileInput}
                    aria-label="Add photo"
                    className="aspect-square rounded-2xl border border-dashed border-neutral-200 dark:border-stone-800 bg-white/15 dark:bg-stone-800/15 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-neutral-400 hover:text-emerald-500 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-center focus:outline-hidden"
                  >
                    <div className="w-7.5 h-7.5 rounded-full bg-neutral-100 dark:bg-stone-850 flex items-center justify-center shadow-3xs text-neutral-400 group-hover:text-emerald-500 transition-colors">
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-[9px] font-black uppercase text-neutral-550 dark:text-stone-500 tracking-wider select-none leading-none">
                        Slot {index + 1}
                      </span>
                      <span className="text-[10px] font-extrabold text-neutral-500 dark:text-stone-400 select-none">
                        {label}
                      </span>
                    </div>
                  </button>
                );
              }
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Recommended photos checklist */}
      <div className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-3.5">
        <h4 className="text-[11px] font-black uppercase text-neutral-400 dark:text-stone-500 tracking-wider">
          Recommended photos Checklist
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {checklistItems.map((item, idx) => {
            // Is this checked based on uploaded photo counts?
            // "If number of photos added is equal to or greater than the item index + 1" (i.e., at least that rank slot exists)
            const isChecked = photos.length >= idx + 1;

            return (
              <div 
                key={idx} 
                className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition-all duration-350 select-none ${
                  isChecked 
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                    : 'bg-neutral-50/50 dark:bg-stone-900/10 border-neutral-100/50 dark:border-stone-850 text-neutral-400 dark:text-stone-500'
                }`}
              >
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isChecked 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-neutral-200 dark:bg-stone-800 text-neutral-400 dark:text-stone-600'
                }`}>
                  <Check className="w-2.75 h-2.75 stroke-[3]" />
                </div>
                <span className={`text-[10.5px] font-extrabold truncate ${isChecked ? 'line-through opacity-85' : ''}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Real-time Live Listing Preview card automatically mounted in-component with current draft info */}
      <PostListingPreview 
        draft={draft} 
        coverPhotoUrl={photos[0]?.previewUrl} 
      />

      {/* 6. Photo quality note / banner warning against misrepresentation */}
      <div className="flex items-start space-x-2.5 p-4 bg-orange-500/5 dark:bg-orange-950/10 rounded-2xl border border-orange-500/10 text-orange-850 dark:text-orange-400 font-sans shadow-3xs">
        <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 stroke-[2.2] mt-0.5 animate-pulse" />
        <span className="text-[10.5px] font-bold tracking-tight leading-relaxed select-none">
          Use clear, real photos. Avoid misleading images or photos from other houses. Keep listings honest. Misrepresentation leads to immediate account ban.
        </span>
      </div>

    </div>
  );
}
