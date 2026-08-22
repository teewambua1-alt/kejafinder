/**
 * Dev-only seed. Run manually:
 *
 *   npx tsx scripts/seed-dev.ts          # insert
 *   npx tsx scripts/seed-dev.ts --clean  # remove exactly what this inserted
 *
 * Never imported by application code, so the service-role key never reaches the
 * browser bundle. Everything it creates is tagged with SEED_TAG in the listing
 * title so --clean can find it again without guessing.
 *
 * Why this exists: the Phase 6 map cannot be built or verified against an empty
 * database, and the coordinate fabrication it replaces was the only reason the
 * old map ever showed a pin.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const SEED_TAG = '[seed]';
const SEED_EMAIL = 'seed-owner@kejafinder.local';
const SEED_PASSWORD = 'seed-only-not-a-real-account';

function env(name: string): string {
  if (process.env[name]) return process.env[name] as string;
  // .env.local is gitignored and is where the real keys live locally.
  try {
    for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && m[1] === name) return m[2].replace(/^["']|["']$/g, '').trim();
    }
  } catch {
    /* fall through */
  }
  throw new Error('Missing ' + name + '. Set it in .env.local or the environment.');
}

const admin = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface Spec {
  estate: string;
  town: string;
  county: string;
  house_type: string;
  rent: number;
  deposit: number;
  agent: number;
  viewing: number;
  lat: number | null;
  lng: number | null;
  verification: string;
  bathroom: string;
  road: string;
  photo: string;
}

/** Real Nairobi-area coordinates. The last two deliberately have none. */
const SEED_LISTINGS: Spec[] = [
  { estate: 'Kilimani', town: 'Nairobi', county: 'Nairobi', house_type: 'bedsitter', rent: 18000, deposit: 18000, agent: 0, viewing: 0, lat: -1.2906, lng: 36.7822, verification: 'scout', bathroom: 'Private bathroom', road: '5 min from tarmac', photo: 'photo-1522708323590-d24dbb6b0267' },
  { estate: 'Kilimani', town: 'Nairobi', county: 'Nairobi', house_type: 'one_bedroom', rent: 32000, deposit: 32000, agent: 5000, viewing: 0, lat: -1.2938, lng: 36.7869, verification: 'trusted', bathroom: 'Private bathroom', road: 'On the tarmac', photo: 'photo-1502672260266-1c1ef2d93688' },
  { estate: 'Rongai', town: 'Rongai', county: 'Kajiado', house_type: 'single_room', rent: 6500, deposit: 6500, agent: 0, viewing: 200, lat: -1.3961, lng: 36.7519, verification: 'phone', bathroom: 'Shared bathroom', road: '15 min from tarmac', photo: 'photo-1493809842364-78817add7ffb' },
  { estate: 'Rongai', town: 'Rongai', county: 'Kajiado', house_type: 'bedsitter', rent: 9500, deposit: 9500, agent: 1000, viewing: 0, lat: -1.3925, lng: 36.7462, verification: 'none', bathroom: 'Private bathroom', road: '8 min from tarmac', photo: 'photo-1560448204-e02f11c3d0e2' },
  { estate: 'Syokimau', town: 'Syokimau', county: 'Machakos', house_type: 'two_bedroom', rent: 28000, deposit: 56000, agent: 0, viewing: 0, lat: -1.3606, lng: 36.9578, verification: 'location', bathroom: 'Private bathroom', road: 'On the tarmac', photo: 'photo-1484154218962-a197022b5858' },
  { estate: 'Syokimau', town: 'Syokimau', county: 'Machakos', house_type: 'studio', rent: 15000, deposit: 15000, agent: 2500, viewing: 300, lat: -1.3542, lng: 36.9611, verification: 'phone', bathroom: 'Private bathroom', road: '10 min from tarmac', photo: 'photo-1502005229762-cf1b2da7c5d6' },
  { estate: 'Ngong', town: 'Ngong', county: 'Kajiado', house_type: 'mabati', rent: 4500, deposit: 4500, agent: 0, viewing: 0, lat: -1.3592, lng: 36.6536, verification: 'none', bathroom: 'Shared bathroom', road: '20 min from tarmac', photo: 'photo-1416331108676-a22ccb276e35' },
  { estate: 'Athi River', town: 'Athi River', county: 'Machakos', house_type: 'three_bedroom', rent: 45000, deposit: 90000, agent: 8000, viewing: 500, lat: -1.4565, lng: 36.9784, verification: 'trusted', bathroom: 'Private bathroom', road: 'On the tarmac', photo: 'photo-1512917774080-9991f1c4c750' },
  { estate: 'Kitengela', town: 'Kitengela', county: 'Kajiado', house_type: 'bedsitter', rent: 11000, deposit: 11000, agent: 0, viewing: 0, lat: null, lng: null, verification: 'phone', bathroom: 'Private bathroom', road: '12 min from tarmac', photo: 'photo-1505691938895-1758d7feb511' },
  { estate: 'Kahawa', town: 'Nairobi', county: 'Nairobi', house_type: 'student_room', rent: 7000, deposit: 7000, agent: 500, viewing: 0, lat: null, lng: null, verification: 'none', bathroom: 'Shared bathroom', road: '6 min from tarmac', photo: 'photo-1598928506311-c55ded91a20c' },
];

const AMENITY_POOL = [
  'water_available', 'token_electricity', 'private_bathroom', 'shared_bathroom',
  'tiled_floor', 'secure_gate', 'near_main_road', 'near_bus_stage', 'no_agent_fee', 'parking',
];

const TYPE_LABEL: Record<string, string> = {
  single_room: 'Single room', bedsitter: 'Bedsitter', studio: 'Studio',
  one_bedroom: '1 bedroom', two_bedroom: '2 bedroom', three_bedroom: '3 bedroom',
  mabati: 'Mabati house', student_room: 'Student room',
};

async function ensureOwner(): Promise<string> {
  const { data: list } = await admin.auth.admin.listUsers();
  const users = (list?.users ?? []) as Array<{ id: string; email?: string }>;
  const existing = users.find((u) => u.email === SEED_EMAIL);
  if (existing) {
    console.log('  reusing seed owner ' + existing.id);
    return existing.id;
  }
  // The handle_new_user trigger builds the matching profiles row from this metadata.
  const { data, error } = await admin.auth.admin.createUser({
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Seed Caretaker', phone: '+254700000001', role: 'caretaker' },
  });
  if (error || !data.user) throw error ?? new Error('createUser returned no user');
  console.log('  created seed owner ' + data.user.id);
  return data.user.id;
}

async function clean(): Promise<void> {
  const { data: rows } = await admin.from('listings').select('id').like('title', '%' + SEED_TAG + '%');
  const ids = (rows ?? []).map((r) => r.id as string);
  console.log('  ' + ids.length + ' seeded listing(s) found');

  for (const id of ids) {
    const { data: files } = await admin.storage.from('listing-photos').list(id);
    if (files && files.length) {
      await admin.storage.from('listing-photos').remove(files.map((f) => id + '/' + f.name));
    }
  }
  if (ids.length) {
    // listing_images cascades when the listing is deleted.
    await admin.from('listings').delete().in('id', ids);
  }

  const { data: list } = await admin.auth.admin.listUsers();
  const users = (list?.users ?? []) as Array<{ id: string; email?: string }>;
  const owner = users.find((u) => u.email === SEED_EMAIL);
  if (owner) {
    await admin.auth.admin.deleteUser(owner.id);
    console.log('  removed seed owner');
  }
  console.log('clean complete');
}

async function uploadPhoto(listingId: string, unsplashId: string, index: number): Promise<string | null> {
  const url = 'https://images.unsplash.com/' + unsplashId + '?auto=format&fit=crop&w=1200&q=70';
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log('    photo ' + index + ' fetch failed (' + res.status + ')');
      return null;
    }
    const bytes = new Uint8Array(await res.arrayBuffer());
    const path = listingId + '/' + index + '.jpg';
    const { error } = await admin.storage
      .from('listing-photos')
      .upload(path, bytes, { contentType: 'image/jpeg', upsert: true });
    if (error) {
      console.log('    photo ' + index + ' upload failed: ' + error.message);
      return null;
    }
    return path;
  } catch (e) {
    console.log('    photo ' + index + ' error: ' + (e as Error).message);
    return null;
  }
}

async function seed(): Promise<void> {
  const ownerId = await ensureOwner();

  for (let i = 0; i < SEED_LISTINGS.length; i++) {
    const spec = SEED_LISTINGS[i];
    const label = TYPE_LABEL[spec.house_type];
    const title = label + ' in ' + spec.estate + ' ' + SEED_TAG;
    const amenities = AMENITY_POOL.slice(i % 4, (i % 4) + 4);

    const { data: listing, error } = await admin
      .from('listings')
      .insert({
        owner_id: ownerId,
        title,
        description: 'Clean ' + label.toLowerCase() + ' in ' + spec.estate + '. ' + spec.road + '. Water and token electricity available.',
        house_type: spec.house_type,
        monthly_rent: spec.rent,
        deposit_amount: spec.deposit,
        agent_fee: spec.agent,
        viewing_fee: spec.viewing,
        water_charge: 'Included in rent',
        electricity_type: 'Token meter',
        county: spec.county,
        town: spec.town,
        estate: spec.estate,
        landmark: spec.estate + ' shopping centre',
        distance_from_road: spec.road,
        bathroom_type: spec.bathroom,
        toilet_type: spec.bathroom.indexOf('Private') === 0 ? 'Private toilet' : 'Shared toilet',
        floor_level: i % 3 === 0 ? 'Ground floor' : 'Floor ' + (i % 3),
        security: i % 2 === 0 ? 'Gated with watchman' : 'Gated compound',
        contact_name: 'Seed Caretaker',
        contact_role: 'caretaker',
        contact_phone: '+254700000001',
        whatsapp_phone: '254700000001',
        amenities,
        moderation_status: 'approved',
        availability_status: 'available',
        is_available: true,
        verification_level: spec.verification,
        is_featured: i < 2,
        lat: spec.lat,
        lng: spec.lng,
      })
      .select('id')
      .single();

    if (error || !listing) {
      console.log('  ' + title + ': insert failed -- ' + (error ? error.message : 'no row'));
      continue;
    }

    const paths: string[] = [];
    for (let n = 0; n < 2; n++) {
      const p = await uploadPhoto(listing.id as string, spec.photo, n);
      if (p) paths.push(p);
    }
    if (paths.length) {
      await admin.from('listing_images').insert(
        paths.map((storage_path, position) => ({
          listing_id: listing.id,
          storage_path,
          category: position === 0 ? 'room' : 'outside',
          position,
        }))
      );
    }

    const pin = spec.lat === null ? 'no coords' : spec.lat + ', ' + spec.lng;
    console.log('  + ' + title + '  (' + pin + ', ' + paths.length + ' photo(s))');
  }
  console.log('seed complete');
}

const isClean = process.argv.indexOf('--clean') !== -1;
console.log(isClean ? 'Cleaning seeded data...' : 'Seeding dev data...');
(isClean ? clean() : seed()).catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
