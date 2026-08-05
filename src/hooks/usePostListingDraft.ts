import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createListingDraft, updateListingDraft, submitListingForReview } from '../services/postListingService';
import { uploadListingPhoto, saveListingImages } from '../services/photoUploadService';
import type { PostPhotoPreview } from '../components/PostPhotoUploader';

// Matches PostPhotoUploader's SLOT_LABELS order and the listing_images
// category CHECK constraint (supabase/migrations/20260805000001_schema.sql).
const SLOT_CATEGORIES = ['room', 'outside', 'toilet', 'kitchen', 'compound', 'other', 'other', 'other'] as const;

export function usePostListingDraft() {
  const { user, profile } = useAuth();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const canSubmitListing = Boolean(user && profile && profile.role !== 'tenant');

  const clearPostError = () => setError(null);
  const clearFeedback = () => setFeedback(null);

  // Photos only ever get uploaded once, right when the draft is first
  // created — by the time a second saveDraft/submitForReview call happens,
  // draftId is already set, so this never re-runs and never duplicates
  // uploads or listing_images rows for the same wizard session.
  const uploadDraftPhotos = async (listingId: string, photos: PostPhotoPreview[]) => {
    const uploaded = [];
    for (let i = 0; i < photos.length; i++) {
      const result = await uploadListingPhoto(listingId, photos[i].file, SLOT_CATEGORIES[i] ?? 'other');
      if (result) uploaded.push(result);
    }
    if (uploaded.length > 0) {
      await saveListingImages(listingId, uploaded);
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
      if (draftId) {
        // Update existing draft
        const success = await updateListingDraft(draftId, params);
        if (success) {
          setFeedback("Draft saved.");
          return true;
        } else {
          setError("Could not save listing. Your form is still available locally.");
          return false;
        }
      } else {
        // Create new draft
        const newDraft = await createListingDraft(user.id, profile.role, params);
        if (newDraft) {
          setDraftId(newDraft.id);
          if (photos && photos.length > 0) {
            await uploadDraftPhotos(newDraft.id, photos);
          }
          setFeedback("Draft saved.");
          return true;
        } else {
          setError("Could not save listing. Your form is still available locally.");
          return false;
        }
      }
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
      let isNewDraft = false;
      if (!currentDraftId) {
        const newDraft = await createListingDraft(user.id, profile.role, params);
        if (!newDraft) throw new Error("Draft creation failed.");
        currentDraftId = newDraft.id;
        isNewDraft = true;
        setDraftId(currentDraftId);
      } else {
        const updateSuccess = await updateListingDraft(currentDraftId, params);
        if (!updateSuccess) throw new Error("Draft update failed.");
      }

      if (isNewDraft && photos && photos.length > 0) {
        await uploadDraftPhotos(currentDraftId, photos);
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
