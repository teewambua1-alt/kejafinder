import { supabase } from '../lib/supabase/client';

/**
 * Profile-level verification requests.
 *
 * `public.verification_requests` has existed since the initial schema, with a
 * complete RLS policy set — insert restricted to `requester_id = auth.uid()
 * and status = 'pending'`, select to your own rows or an admin, update to
 * admins only. Nothing in the app had ever written to it, so the profile page
 * showed an inert "Not yet" pill that looked like a control and did nothing.
 *
 * The table's `request_type` CHECK allows exactly 'phone', 'location', 'scout'
 * and 'landlord_trust'. Note what is missing: there is no identity/ID type, so
 * ID verification genuinely cannot be self-requested and is stated as
 * admin-initiated rather than given a button that would fail the constraint.
 */
export type VerificationRequestType = 'phone' | 'location' | 'scout' | 'landlord_trust';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface VerificationRequest {
  id: string;
  request_type: VerificationRequestType;
  status: VerificationStatus;
  created_at: string;
}

/** This account's own requests. RLS already scopes to auth.uid(). */
export async function getMyVerificationRequests(): Promise<VerificationRequest[] | null> {
  const { data, error } = await supabase
    .from('verification_requests')
    .select('id, request_type, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching verification requests:', error);
    return null;
  }
  return (data ?? []) as VerificationRequest[];
}

/**
 * Files a request. Returns null on success, or a user-facing message on
 * failure — a plain nullable rather than a discriminated union, because this
 * project compiles without `strict`, where narrowing `{ok: true} | {ok: false;
 * message: string}` in an else-branch does not reliably reach `message`.
 *
 * `status` is passed explicitly as 'pending' because the RLS insert policy
 * checks it; relying on the column default would hide that constraint from the
 * call site.
 */
export async function requestVerification(
  requesterId: string,
  requestType: VerificationRequestType
): Promise<string | null> {
  const { error } = await supabase.from('verification_requests').insert({
    requester_id: requesterId,
    request_type: requestType,
    status: 'pending',
  });

  if (error) {
    console.error('Error creating verification request:', error);
    return 'Could not send the request. Please try again.';
  }
  return null;
}
