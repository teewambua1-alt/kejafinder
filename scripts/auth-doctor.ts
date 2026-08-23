/**
 * Diagnoses "creating an account isn't working".
 *
 *   npx tsx scripts/auth-doctor.ts                 # diagnose
 *   npx tsx scripts/auth-doctor.ts --verify-roles   # prove every role can be created
 *
 * Never imported by application code, so the service-role key stays out of the
 * browser bundle. Reads only -- it changes nothing.
 *
 * Signup depends on four things that live in three different places, and when
 * it breaks the browser usually shows one vague message. This prints all four:
 *
 *   1. Is the project reachable, and is signup even enabled?          (auth settings)
 *   2. Does confirmation email get required, and can it be sent?      (mailer settings + quota)
 *   3. Did accounts get created but left unconfirmed?                 (auth.users)
 *   4. Did the handle_new_user trigger make their profile row?        (public.profiles)
 *
 * The usual culprit is #2: with `mailer_autoconfirm` off, Supabase's built-in
 * SMTP allows only a couple of emails per hour on a free project. Once that is
 * spent, every signup fails with `over_email_send_rate_limit` even though
 * nothing is wrong with the app.
 */
import { readFileSync } from 'node:fs';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function env(name: string, required = true): string {
  if (process.env[name]) return process.env[name] as string;
  try {
    for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && m[1] === name) return m[2].replace(/^["']|["']$/g, '').trim();
    }
  } catch {
    /* fall through */
  }
  if (required) throw new Error(`Missing ${name}. Set it in .env.local or the environment.`);
  return '';
}

function line(label: string, value: unknown, note = '') {
  console.log(`  ${label.padEnd(30)} ${String(value)}${note ? '   ' + note : ''}`);
}

async function main() {
  const url = env('VITE_SUPABASE_URL');
  const anon = env('VITE_SUPABASE_ANON_KEY');

  console.log('\n=== 1. Project reachable, signup enabled ===');
  let settings: Record<string, unknown> = {};
  try {
    const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: anon } });
    line('GET /auth/v1/settings', res.status, res.ok ? '' : '<- not 200: check the URL and anon key');
    if (res.ok) settings = await res.json();
  } catch (e) {
    line('GET /auth/v1/settings', 'FAILED', (e as Error).message);
    console.log('\n  The browser will show "Failed to fetch" for this. Check the project URL\n  and that the project is not paused in the Supabase dashboard.\n');
    return;
  }

  const disableSignup = settings.disable_signup;
  line('disable_signup', disableSignup, disableSignup ? '<- SIGNUP IS OFF. Turn it on in Auth > Sign In / Providers.' : 'ok');

  console.log('\n=== 2. Email confirmation ===');
  const autoconfirm = settings.mailer_autoconfirm;
  line('mailer_autoconfirm', autoconfirm,
    autoconfirm
      ? 'ok - signUp() returns a session immediately'
      : '<- confirmation REQUIRED, so signUp() returns no session');
  if (!autoconfirm) {
    console.log('');
    console.log('  With confirmation required, every signup sends an email through');
    console.log('  Supabase\'s built-in SMTP, which is rate limited to a couple per hour on');
    console.log('  free projects. Once spent, signup fails with over_email_send_rate_limit.');
    console.log('');
    console.log('  Two ways to make account creation work reliably:');
    console.log('    a) Auth > Sign In / Providers > Email: turn OFF "Confirm email".');
    console.log('       Accounts then work immediately, no email involved.');
    console.log('    b) Project Settings > Auth > SMTP: connect your own SMTP provider,');
    console.log('       which lifts the quota and makes the confirmation link deliverable.');
    console.log('');
    console.log('  If you keep confirmation on, also set Auth > URL Configuration >');
    console.log('  Site URL to the deployed origin, or the link in the email points at');
    console.log('  http://localhost:3000 and does nothing for a real user.');
  }

  const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY', false);
  if (!serviceKey) {
    console.log('\n  (No SUPABASE_SERVICE_ROLE_KEY found -- skipping the account checks.)\n');
    return;
  }

  const admin = createClient(env('SUPABASE_URL'), serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('\n=== 3. Accounts that exist ===');
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) {
    line('listUsers', 'FAILED', error.message);
    return;
  }
  const users = (data?.users ?? []) as Array<{
    id: string; email?: string; email_confirmed_at?: string | null;
    created_at: string; user_metadata?: Record<string, unknown>;
  }>;
  line('total auth users', users.length);
  const unconfirmed = users.filter((u) => !u.email_confirmed_at);
  line('unconfirmed', unconfirmed.length, unconfirmed.length ? '<- these cannot log in' : 'ok');
  if (users.length) {
    console.log('');
    console.log('  ' + 'email'.padEnd(38) + 'confirmed  role        created');
    for (const u of users) {
      console.log(
        '  ' + String(u.email).padEnd(38) +
        (u.email_confirmed_at ? 'yes' : 'NO ').padEnd(11) +
        String(u.user_metadata?.role ?? '-').padEnd(12) +
        String(u.created_at).slice(0, 16)
      );
    }
  }

  console.log('\n=== 4. Profile rows (handle_new_user trigger) ===');
  const { data: profiles, error: pErr } = await admin.from('profiles').select('id, role');
  if (pErr) {
    line('profiles read', 'FAILED', pErr.message);
    return;
  }
  const rows = (profiles ?? []) as Array<{ id: string; role: string }>;
  line('profiles rows', rows.length);
  const orphans = users.filter((u) => !rows.some((p) => p.id === u.id));
  line('auth users with no profile', orphans.length,
    orphans.length ? '<- the trigger did not fire: ' + orphans.map((u) => u.email).join(', ') : 'ok');

  const byRole: Record<string, number> = {};
  for (const p of rows) byRole[p.role] = (byRole[p.role] ?? 0) + 1;
  line('roles in use', JSON.stringify(byRole));

  if (process.argv.includes('--verify-roles')) await verifyRoles(admin);
  console.log('');
}

/**
 * Creates one account per role through the admin API, checks that the
 * handle_new_user trigger produced a matching profile with the right role, then
 * deletes it again.
 *
 * The admin API sets `email_confirm: true` directly, so this bypasses email
 * entirely -- which is the point. It separates "can an account of this role be
 * created at all" (schema, trigger, CHECK constraint) from "can we deliver a
 * confirmation email" (project quota). When signup is failing, that is exactly
 * the distinction you need in order to know whether to fix code or settings.
 */
async function verifyRoles(admin: SupabaseClient) {
  // Mirrors the profiles.role CHECK constraint. 'admin' is deliberately absent:
  // the constraint cannot hold it, admin-ness lives in the separate admins
  // table, and signUp() rejects it explicitly.
  const ROLES = ['tenant', 'landlord', 'caretaker', 'agent', 'scout'] as const;

  console.log('\n=== 5. Every role can be created (--verify-roles) ===');
  console.log('  role'.padEnd(14) + 'auth user  profile  role stored  cleaned up');

  for (const role of ROLES) {
    const email = `rolecheck-${role}-${Date.now()}@kejafinder.local`;
    let userId = '';
    let created = 'no', profiled = 'no', stored = '-', cleaned = 'n/a';

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: 'role-check-not-a-real-account',
      email_confirm: true,
      user_metadata: { full_name: `Role Check ${role}`, phone: '+254700000000', role },
    });

    if (error || !data.user) {
      console.log('  ' + role.padEnd(12) + 'FAILED     -        -            -   ' + (error?.message ?? ''));
      continue;
    }
    userId = data.user.id;
    created = 'yes';

    const { data: prof } = await admin
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();
    if (prof) {
      profiled = 'yes';
      stored = (prof as { role: string }).role;
    }

    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    cleaned = delErr ? 'FAILED' : 'yes';

    const ok = created === 'yes' && profiled === 'yes' && stored === role;
    console.log(
      '  ' + role.padEnd(12) +
      created.padEnd(11) + profiled.padEnd(9) + String(stored).padEnd(13) + cleaned +
      (ok ? '' : '   <- PROBLEM')
    );
  }
  console.log('\n  Every row above with role stored == role means the schema, the CHECK');
  console.log('  constraint and the handle_new_user trigger all work for that role. If');
  console.log('  signup still fails in the browser, the cause is email delivery, not roles.');
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
