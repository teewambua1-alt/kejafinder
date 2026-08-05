import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createListingDraft, updateListingDraft, submitListingForReview } from '../services/postListingService';

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

  const saveDraft = async (params: any) => {
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

  const submitForReview = async (params: any) => {
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
    canUseFirestorePosting: canSubmitListing,
    saveDraft,
    submitForReview,
    clearPostError,
    clearFeedback
  };
}
