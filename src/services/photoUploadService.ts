import { supabase } from '../lib/supabase/client';

export interface UploadedPhoto {
  storagePath: string;
  category?: string;
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

export async function saveListingImages(listingId: string, photos: UploadedPhoto[]): Promise<boolean> {
  if (photos.length === 0) return true;

  const rows = photos.map((photo, index) => ({
    listing_id: listingId,
    storage_path: photo.storagePath,
    category: photo.category ?? null,
    position: index,
  }));

  const { error } = await supabase.from('listing_images').insert(rows);
  if (error) {
    console.error('Error saving listing image records:', error);
    return false;
  }
  return true;
}
