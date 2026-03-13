import { supabase } from '@/lib/supabase';
import type { User, UserRole } from '@/types/user';
import type { PaginatedResult } from '@/types/article';

/**
 * Sign in with email and password.
 *
 * @param email    User's email address.
 * @param password User's password.
 * @returns The authenticated session.
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(`Sign-in failed: ${error.message}`);
  return data.session;
}

/**
 * Register a new account and sign in.
 *
 * @param email    New user's email address.
 * @param password New user's password.
 * @param fullName New user's full name (stored in auth metadata).
 * @returns The new session.
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) throw new Error(`Sign-up failed: ${error.message}`);
  return data.session;
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Sign-out failed: ${error.message}`);
}

/**
 * Get the currently authenticated user's profile from the `users` table.
 * Returns `null` if no session exists.
 */
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // profile not yet created
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }

  return data as User;
}

/**
 * Update a user's profile in the `users` table.
 *
 * @param id   The user ID.
 * @param data Fields to update (full_name, avatar_url, etc.).
 * @returns The updated user profile.
 */
export async function updateUserProfile(
  id: string,
  data: Partial<User>
): Promise<User> {
  const { data: user, error } = await supabase
    .from('users')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(`Failed to update user profile: ${error.message}`);
  return user as User;
}

/**
 * Fetch all users with pagination (admin-only).
 *
 * @param page     Current page number (1-indexed).
 * @param pageSize Number of users per page.
 */
export async function getUsers(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResult<User>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(`Failed to fetch users: ${error.message}`);

  const total = count ?? 0;

  return {
    data: (data as User[]) ?? [],
    count: total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Update a user's role (admin-only).
 *
 * @param userId The user ID.
 * @param role   The new role to assign.
 * @returns The updated user profile.
 */
export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw new Error(`Failed to update user role: ${error.message}`);
  return data as User;
}

/**
 * Subscribe to authentication state changes.
 *
 * @param callback Function called whenever auth state changes.
 * @returns An object with an `unsubscribe` method.
 */
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);

  return subscription;
}
