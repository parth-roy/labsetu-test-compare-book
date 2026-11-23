// Supabase Client with Resilient Network Retries and Environment Fallbacks
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { brokeredPreviewStorage } from './previewAuthStorage';

const DEFAULT_SUPABASE_URL = "https://dmzmlntnhjypsgtmqdpe.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtem1sbnRuaGp5cHNndG1xZHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2ODY1NTcsImV4cCI6MjA4NjI2MjU1N30.AdfoAIRc7MJDKrAhNzqH4evUkj4T0QekMFnKUO-uE5U";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_KEY;

/**
 * Resilient fetch wrapper with retry logic for transient DNS, network drops, and 50x errors
 */
const fetchWithRetry: typeof fetch = async (input, init) => {
  const maxRetries = 2;
  const backoff = 400;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const requestToFetch =
        typeof Request !== 'undefined' && input instanceof Request
          ? input.clone()
          : input;
      const response = await fetch(requestToFetch, init);
      if ([502, 503, 504].includes(response.status) && attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, backoff * (attempt + 1)));
        continue;
      }
      return response;
    } catch (err: any) {
      const isNetwork =
        err instanceof TypeError ||
        /failed to fetch|fetch failed|networkerror|network request failed|enotfound|econnreset|timeout/i.test(
          err?.message || ''
        );
      if (isNetwork && attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, backoff * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  return fetch(input, init);
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: brokeredPreviewStorage(),
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: fetchWithRetry,
  },
});
