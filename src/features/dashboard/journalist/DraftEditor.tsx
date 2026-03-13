import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Send, Eye, Clock } from 'lucide-react';
import type { Category, Language } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { articleService } from '@/services/articleService';
import { categoryService } from '@/services/categoryService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { ImageUploader } from './ImageUploader';
import toast from 'react-hot-toast';

export function DraftEditor() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [language, setLanguage] = useState<Language>('om');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch existing article if editing
  useEffect(() => {
    if (!id) return;
    const loadArticle = async () => {
      setLoading(true);
      try {
        const article = await articleService.getArticleById(id);
        if (article) {
          setTitle(article.title);
          setContent(article.content);
          setExcerpt(article.excerpt);
          setCategoryId(article.category_id);
          setLanguage(article.language);
          setCoverImageUrl(article.cover_image_url ?? '');
          setTags(article.tags?.map((t) => t.name).join(', ') ?? '');
        }
      } catch (err) {
        console.error('Failed to load article:', err);
        toast.error('Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  // Auto-save simulation
  useEffect(() => {
    if (!title && !content) return;
    const timer = setTimeout(() => {
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 30000);
    return () => clearTimeout(timer);
  }, [title, content]);

  const validateForm = useCallback((): boolean => {
    if (!title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!categoryId) {
      toast.error('Please select a category');
      return false;
    }
    return true;
  }, [title, categoryId]);

  const handleSaveDraft = async () => {
    if (!validateForm() || !user) return;
    setSaving(true);
    try {
      const articleData = {
        title: title.trim(),
        content,
        excerpt: excerpt.trim(),
        category_id: categoryId,
        language,
        cover_image_url: coverImageUrl || undefined,
        status: 'draft' as const,
        author_id: user.id,
      };

      if (isEditing && id) {
        await articleService.updateArticle(id, articleData);
        toast.success('Draft saved');
      } else {
        const created = await articleService.createArticle(articleData);
        toast.success('Draft created');
        navigate(`/dashboard/journalist/edit/${created.id}`, { replace: true });
      }
    } catch (err) {
      console.error('Failed to save draft:', err);
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!validateForm() || !user) return;
    if (!content.trim()) {
      toast.error('Article content is required before submitting for review');
      return;
    }
    setSubmitting(true);
    try {
      const articleData = {
        title: title.trim(),
        content,
        excerpt: excerpt.trim(),
        category_id: categoryId,
        language,
        cover_image_url: coverImageUrl || undefined,
        status: 'review' as const,
        author_id: user.id,
      };

      if (isEditing && id) {
        await articleService.updateArticle(id, articleData);
      } else {
        await articleService.createArticle(articleData);
      }
      toast.success('Article submitted for review');
      navigate('/dashboard/journalist');
    } catch (err) {
      console.error('Failed to submit article:', err);
      toast.error('Failed to submit for review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-serif font-bold text-navy-900">
          {isEditing ? 'Edit Article' : 'New Article'}
        </h2>
        <div className="flex items-center gap-2">
          {autoSaved && (
            <span className="flex items-center text-sm text-green-600">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Auto-saved
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <Input
          type="text"
          placeholder="Article title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-serif font-bold border-0 border-b border-navy-200 rounded-none px-0 focus:ring-0 focus:border-gold"
        />
      </div>

      {/* Category & Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-navy-200 rounded-lg bg-white text-navy-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Language</label>
          <div className="flex rounded-lg border border-navy-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setLanguage('om')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                language === 'om'
                  ? 'bg-navy-900 text-white'
                  : 'bg-white text-navy-600 hover:bg-navy-50'
              }`}
            >
              Afaan Oromoo
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'bg-navy-900 text-white'
                  : 'bg-white text-navy-600 hover:bg-navy-50'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1">Cover Image</label>
        <ImageUploader
          value={coverImageUrl}
          onChange={setCoverImageUrl}
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article content here..."
          rows={20}
          className="w-full px-4 py-3 border border-navy-200 rounded-lg font-mono text-sm text-navy-800 resize-y focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder:text-navy-400"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1">
          Excerpt
          <span className="text-navy-400 font-normal ml-1">({excerpt.length}/300)</span>
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => {
            if (e.target.value.length <= 300) setExcerpt(e.target.value);
          }}
          placeholder="Brief summary of the article..."
          rows={3}
          maxLength={300}
          className="w-full px-4 py-3 border border-navy-200 rounded-lg text-sm text-navy-800 resize-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder:text-navy-400"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1">
          Tags
          <span className="text-navy-400 font-normal ml-1">(comma-separated)</span>
        </label>
        <Input
          type="text"
          placeholder="politics, economy, culture..."
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-navy-100">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/journalist')}
        >
          Cancel
        </Button>
        <div className="flex-1" />
        <Button
          variant="secondary"
          onClick={() => window.open(`/article/preview`, '_blank')}
          disabled={!title}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveDraft}
          disabled={saving}
        >
          {saving ? <Spinner size="sm" /> : <Save className="h-4 w-4 mr-2" />}
          Save Draft
        </Button>
        <Button
          variant="gold"
          onClick={handleSubmitForReview}
          disabled={submitting}
        >
          {submitting ? <Spinner size="sm" /> : <Send className="h-4 w-4 mr-2" />}
          Submit for Review
        </Button>
      </div>
    </div>
  );
}
