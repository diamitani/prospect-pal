import { createClient } from '@supabase/supabase-js';

/**
 * Agent Session Storage
 *
 * Manages conversation history persistence in Supabase for the agent chat.
 * Enables session resumption and multi-device continuity.
 */

interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  toolCalls?: any[];
  toolResults?: any[];
}

/**
 * Save agent session to Supabase
 */
export async function saveAgentSession(
  userId: string,
  sessionId: string,
  messages: AgentMessage[]
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase not configured for agent sessions');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabase.from('agent_sessions').upsert(
    {
      user_id: userId,
      session_id: sessionId,
      messages,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,session_id',
    }
  );

  if (error) {
    console.error('Failed to save agent session:', error);
    throw new Error(`Failed to save session: ${error.message}`);
  }
}

/**
 * Load agent session from Supabase
 */
export async function loadAgentSession(
  userId: string,
  sessionId: string
): Promise<AgentMessage[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase not configured for agent sessions');
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from('agent_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('session_id', sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Session not found, return empty array
      return [];
    }
    console.error('Failed to load agent session:', error);
    throw new Error(`Failed to load session: ${error.message}`);
  }

  return data?.messages || [];
}

/**
 * List all sessions for a user
 */
export async function listAgentSessions(userId: string): Promise<
  Array<{
    sessionId: string;
    messageCount: number;
    lastUpdated: string;
    preview: string;
  }>
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase not configured for agent sessions');
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from('agent_sessions')
    .select('session_id, messages, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Failed to list agent sessions:', error);
    throw new Error(`Failed to list sessions: ${error.message}`);
  }

  return (data || []).map((session) => {
    const messages = session.messages as AgentMessage[];
    const firstUserMessage = messages.find((m) => m.role === 'user');

    return {
      sessionId: session.session_id,
      messageCount: messages.length,
      lastUpdated: session.updated_at,
      preview: firstUserMessage?.content.slice(0, 100) || 'New session',
    };
  });
}

/**
 * Delete an agent session
 */
export async function deleteAgentSession(
  userId: string,
  sessionId: string
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase not configured for agent sessions');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabase
    .from('agent_sessions')
    .delete()
    .eq('user_id', userId)
    .eq('session_id', sessionId);

  if (error) {
    console.error('Failed to delete agent session:', error);
    throw new Error(`Failed to delete session: ${error.message}`);
  }
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
