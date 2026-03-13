import { supabase } from '@/lib/supabase';
import type { Category, Tag } from '@/types/category';

/**
 * Fetch all categories ordered alphabetically by name.
 *
 * @returns Array of all categories.
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
  return (data as Category[]) ?? [];
}

/**
 * Fetch a single category by its slug.
 *
 * @param slug The URL-friendly slug.
 * @returns The category or `null` if not found.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data as Category;
}

/**
 * Create a new category.
 *
 * @param data Category fields (name, slug, description).
 * @returns The newly created category.
 */
export async function createCategory(
  data: Partial<Category>
): Promise<Category> {
  const { data: category, error } = await supabase
    .from('categories')
    .insert(data)
    .select('*')
    .single();

  if (error) throw new Error(`Failed to create category: ${error.message}`);
  return category as Category;
}

/**
 * Update an existing category.
 *
 * @param id   The category ID.
 * @param data Fields to update.
 * @returns The updated category.
 */
export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<Category> {
  const { data: category, error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(`Failed to update category: ${error.message}`);
  return category as Category;
}

/**
 * Delete a category by its ID.
 *
 * @param id The category ID.
 */
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete category: ${error.message}`);
}

/**
 * Fetch all tags ordered by name.
 *
 * @returns Array of all tags.
 */
export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(`Failed to fetch tags: ${error.message}`);
  return (data as Tag[]) ?? [];
}
