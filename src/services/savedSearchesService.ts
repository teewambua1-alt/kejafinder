import { supabase } from '../lib/supabase/client';
import type { Database, Json } from '../types/database';

export type SupabaseSavedSearch = Database['public']['Tables']['saved_searches']['Row'];

export async function getUserSavedSearches(userId: string): Promise<SupabaseSavedSearch[] | null> {
  const { data, error } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved searches:', error);
    return null;
  }
  return data;
}

export async function createSavedSearch(params: {
  userId: string;
  label: string;
  query: string;
  filters: Json;
  sort: string;
}): Promise<SupabaseSavedSearch | null> {
  const { data, error } = await supabase
    .from('saved_searches')
    .insert({
      user_id: params.userId,
      label: params.label,
      query: params.query,
      filters: params.filters,
      sort: params.sort,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating saved search:', error);
    return null;
  }
  return data;
}

export async function deleteSavedSearch(userId: string, id: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_searches')
    .delete()
    .eq('user_id', userId)
    .eq('id', id);

  if (error) {
    console.error('Error deleting saved search:', error);
    return false;
  }
  return true;
}
