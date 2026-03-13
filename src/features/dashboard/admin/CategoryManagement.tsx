import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, FolderOpen, GripVertical } from 'lucide-react';
import type { Category } from '@/types';
import { categoryService } from '@/services/categoryService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

interface CategoryWithCount extends Category {
  article_count?: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithCount | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategoriesWithCounts();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setEditingCategory(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description ?? '');
    setShowForm(true);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingCategory) {
      setSlug(slugify(value));
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, payload);
        toast.success('Category updated');
      } else {
        await categoryService.createCategory(payload);
        toast.success('Category created');
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      toast.error('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryService.deleteCategory(deleteTarget.id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      toast.error('Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-bold text-navy-900">Categories</h3>
        <Button variant="gold" size="sm" onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Category List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-navy-500">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 text-navy-300" />
          <p>No categories yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
          <div className="divide-y divide-navy-100">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-navy-50/50 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-navy-300 cursor-grab flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-navy-900">{category.name}</h4>
                    <span className="text-xs text-navy-400">/{category.slug}</span>
                  </div>
                  {category.description && (
                    <p className="text-xs text-navy-500 mt-0.5 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-navy-500 flex-shrink-0">
                  {category.article_count ?? 0} articles
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEditForm(category)}
                    className="p-2 text-navy-500 hover:text-navy-700 hover:bg-navy-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(category)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Name</label>
            <Input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Slug</label>
            <Input
              type="text"
              placeholder="category-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
            <textarea
              placeholder="Brief description of this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm text-navy-800 resize-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder:text-navy-400"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={resetForm} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? <Spinner size="sm" /> : editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Category"
        >
          <div className="space-y-4">
            {(deleteTarget.article_count ?? 0) > 0 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-600 text-sm">⚠️</span>
                <p className="text-sm text-amber-700">
                  This category has <strong>{deleteTarget.article_count}</strong> article(s). Deleting it may affect those articles.
                </p>
              </div>
            )}
            <p className="text-navy-600">
              Are you sure you want to delete &ldquo;{deleteTarget.name}&rdquo;?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Spinner size="sm" /> : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
