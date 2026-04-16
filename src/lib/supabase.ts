import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

const supabaseUrl = () => requireEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = () => requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabaseServiceRoleKey = () => requireEnv('SUPABASE_SERVICE_ROLE_KEY');

export async function createSupabaseRouteClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          cookieStore.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });
}

export function createSupabaseAdminClient() {
  return createClient(supabaseUrl(), supabaseServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabasePublicClient() {
  return createClient(supabaseUrl(), supabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
