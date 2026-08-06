import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createListingDraft, updateListingDraft, submitListingForReview } from '../services/postListingService';
import { uploadListingPhoto, saveListingImages, deleteListingImage, updateListingImagePosition } from '../services/photoUploadService';
import type { PostPhotoPreview } from '../components/PostPhotoUploader';

// Matches PostPhotoUploader's SLOT_LABELS order and the listing_images
// category CHECK constraint (supabase/migrations/20260805000001_schema.sql).
const SLOT_CATEGORIES = ['room', 'outside', 'toilet', 'kitchen', 'compound', 'other', 'other', 'other'] as const;

type UploadedEntry = { storagePath: string; position: number };

export function usePostListingDraft() {
  const { user, profile } = useAuth();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  // Maps each PostPhotoPreview.id already persisted to Supabase Storage to
  // its storage path + last-known position -- lets every subsequent save
  // upload only genuinely new photos, delete rows for photos removed since
  // the last save, and reposition ones moved (e.g. via "Set cover") instead
  // of the old "only ever runs on the very first save" behavior.
  const uploadedPhotosRef = useRef<Map<string, UploadedEntry>>(new Map());

  const canSubmitListing = Boolean(user && profile && profile.role !== 'tenant');

  const clearPostError = () => setError(null);
  const clearFeedback = () => setFeedback(null);

  const syncDraftPhotos = async (listingId: string, photos: PostPhotoPreview[]) => {
    const uploadedMap = uploadedPhotosRef.current;
    const currentIds = new Set(photos.map((p) => p.id));

    // Delete rows/objects for photos removed since the last save.
    for (const [id, entry] of uploadedMap) {
      if (!currentIds.has(id)) {
        await deleteListingImage(listingId, entry.storagePath);
        uploadedMap.delete(id);
      }
    }

    // Upload photos not already persisted, and reposition ones that moved
    // (e.g. an earlier-saved photo promoted to cover) -- both keyed off each
    // photo's real current index, not just the subset that's new.
    for (let index = 0; index < photos.length; index++) {
      const photo = photos[index];
      const existing = uploadedMap.get(photo.id);

      if (!existing) {
        const result = await uploadListingPhoto(listingId, photo.file, SLOT_CATEGORIES[index] ?? 'other');
        if (result) {
          await saveListingImages(listingId, [{ ...result, position: index }]);
          uploadedMap.set(photo.id, { storagePath: result.storagePath, position: index });
        }
      } else if (existing.position !== index) {
        await updateListingImagePosition(listingId, existing.storagePath, index);
        existing.position = index;
      }
    }
  };

  const saveDraft = async (params: any, photos?: PostPhotoPreview[]) => {
    if (!user || !profile) {
      setError("Log in to submit vacancies.");
      return false;
    }

    if (profile.role === 'tenant') {
      setError("Only landlords, caretakers, agents, and scouts can submit vacancies.");
      return false;
    }

    setIsSaving(true);
    setError(null);
    setFeedback(null);

    try {
      let currentDraftId = draftId;
      if (!currentDraftId) {
        const newDraft = await createListingDraft(user.id, profile.role, params);
        if (!newDraft) {
          setError("Could not save listing. Your form is still available locally.");
          return false;
        }
        currentDraftId = newDraft.id;
        setDraftId(currentDraftId);
      } else {
        const success = await updateListingDraft(currentDraftId, params);
        if (!success) {
          setError("Could not save listing. Your form is still available locally.");
          return false;
        }
      }

      if (photos) {
        await syncDraftPhotos(currentDraftId, photos);
      }

      setFeedback("Draft saved.");
      return true;
    } catch (err: any) {
      console.error("Draft save error:", err);
      setError(err?.message || "Could not save listing. Your form is still available locally.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const submitForReview = async (params: any, photos?: PostPhotoPreview[]) => {
    if (!canSubmitListing || !user || !profile) return false;

    setIsSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      // Always save draft first to ensure latest details are recorded
      let currentDraftId = draftId;
      if (!currentDraftId) {
        const newDraft = await createListingDraft(user.id, profile.role, params);
        if (!newDraft) throw new Error("Draft creation failed.");
        currentDraftId = newDraft.id;
        setDraftId(currentDraftId);
      } else {
        const updateSuccess = await updateListingDraft(currentDraftId, params);
        if (!updateSuccess) throw new Error("Draft update failed.");
      }

      if (photos) {
        await syncDraftPhotos(currentDraftId, photos);
      }

      // Submit for review
      const submitSuccess = await submitListingForReview(currentDraftId);
      if (submitSuccess) {
        setFeedback("Listing submitted for review.");
        return true;
      } else {
        throw new Error("Submit failed.");
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      setError("Could not submit listing. Your form is still available locally.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    draftId,
    isSaving,
    isSubmitting,
    error,
    feedback,
    canSubmitListing,
    saveDraft,
    submitForReview,
    clearPostError,
    clearFeedback
  };
}
