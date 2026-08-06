import { supabase } from '../lib/supabase/client';

export interface UploadedPhoto {
  storagePath: string;
  category?: string;
}

export interface PositionedPhoto extends UploadedPhoto {
  position: number;
}

// Photos always land in the private bucket first — a listing isn't public
// until it's approved, and the webhook-driven sync (see server.ts) moves
// them into the public bucket only once moderation_status/availability
// actually make the listing visible. Path convention {listingId}/{uuid}.ext
// matches the RLS policies in supabase/migrations/..._storage.sql, which key
// off the first path segment being the listing's id.
export async function uploadListingPhoto(listingId: string, file: File, category?: string): Promise<UploadedPhoto | null> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${listingId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('listing-photos-pending')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error('Error uploading listing photo:', error);
    return null;
  }

  return { storagePath: path, category };
}

// Each photo carries its own explicit position (its real index in the
// wizard's current photo order) rather than deriving one from array index --
// this function is called with only the newly-uploaded subset on later
// saves, so array index alone would collide with already-saved positions.
export async function saveListingImages(listingId: string, photos: PositionedPhoto[]): Promise<boolean> {
  if (photos.length === 0) return true;

  const rows = photos.map((photo) => ({
    listing_id: listingId,
    storage_path: photo.storagePath,
    category: photo.category ?? null,
    position: photo.position,
  }));

  const { error } = await supabase.from('listing_images').insert(rows);
  if (error) {
    console.error('Error saving listing image records:', error);
    return false;
  }
  return true;
}

// Keeps the cover photo (position 0) and slot-category badges correct when
// the user reorders via "Set cover" after an earlier save already persisted
// the old ordering.
export async function updateListingImagePosition(listingId: string, storagePath: string, position: number): Promise<boolean> {
  const { error } = await supabase
    .from('listing_images')
    .update({ position })
    .eq('listing_id', listingId)
    .eq('storage_path', storagePath);

  if (error) {
    console.error('Error updating listing image position:', error);
    return false;
  }
  return true;
}

// Deletes both the DB row and the underlying storage object -- a draft/
// pending_review listing's photos always still live in the private pending
// bucket (the webhook only moves them to the public bucket on approval), so
// this is always the right bucket for anything removable from this flow.
export async function deleteListingImage(listingId: string, storagePath: string): Promise<boolean> {
  const { error: storageError } = await supabase.storage
    .from('listing-photos-pending')
    .remove([storagePath]);
  if (storageError) {
    console.error('Error deleting listing photo from storage:', storageError);
  }

  const { error } = await supabase
    .from('listing_images')
    .delete()
    .eq('listing_id', listingId)
    .eq('storage_path', storagePath);

  if (error) {
    console.error('Error deleting listing image record:', error);
    return false;
  }
  return true;
}
