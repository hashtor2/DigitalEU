import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
})

export async function isUserInBetaAllowlist(email: string): Promise<boolean> {
  const { data } = await supabase
    .from('beta_allowlist')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  return !!data
}

export async function createProfile(email: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ email })
    .select()
    .single()

  return { data, error }
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function getMailboxConnections(userId: string) {
  const { data, error } = await supabase
    .from('mailbox_connections')
    .select('*')
    .eq('user_id', userId)

  return { data, error }
}

export async function storeEncryptedOAuthToken(
  userId: string,
  provider: 'gmail' | 'outlook',
  accessToken: string,
  refreshToken: string | null,
  scopes: string[],
) {
  const { data, error } = await supabase
    .from('mailbox_connections')
    .upsert({
      user_id: userId,
      provider,
      oauth_token_encrypted: accessToken,
      oauth_refresh_token_encrypted: refreshToken,
      scopes: scopes.join(' '),
    })
    .select()
    .single()

  return { data, error }
}

export async function revokeMailboxConnection(connectionId: string) {
  const { error } = await supabase
    .from('mailbox_connections')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', connectionId)

  return { error }
}
