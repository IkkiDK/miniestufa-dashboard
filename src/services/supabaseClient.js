import { createClient } from '@supabase/supabase-js';
import config from '../config';

let client;

export function getSupabaseClient() {
  if (!client) {
    const { url, anonKey } = config.supabase;

    if (!url || !anonKey) {
      throw new Error('Configuração do Supabase ausente. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
    }

    client = createClient(url, anonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return client;
}

export default getSupabaseClient;


