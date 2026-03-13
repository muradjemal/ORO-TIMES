import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, RotateCcw, CheckSquare } from 'lucide-react';
import type { Article } from '@/types';
import { articleService } from '@/services/articleService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { StatusIndicator } from './StatusIndicator';
import { formatDate } from '@/utils/formatters';
import toast from 'react-hot-toast';

export function ContentEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadArticle = async () => {
      setLoading(true);
      try {
        const data = await articleService.getArticleById(id);
        if (data) {
          setArticle(data);
          setTitle(data.title);
          setContent(data.content);
          setExcerpt(data.excerpt);
          setOriginalTitle(data.title);
          setOriginalContent(data.content);
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

  const hasChanges = title !== originalTitle || content !== originalContent;

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await articleService.updateArticle(id, {
        title: title.trim(),
        content,
        excerpt: excerpt.trim(),
      });
      setOriginalTitle(title);
      setOriginalContent(content);
      toast.success('Changes saved');
    } catch (err) {
      console.error('Failed to save:', err);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = () => {
    setTitle(originalTitle);
    setContent(originalContent);
    toast.success('Reverted to original');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-navy-600">Article not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor - Left */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-navy-900">Edit Content</h2>
            <StatusIndicator status={article.status} showLabel />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-serif font-bold"
            />
            {title !== originalTitle && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full" />
                Title modified
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={24}
              className="w-full px-4 py-3 border border-navy-200 rounded-lg font-mono text-sm text-navy-800 resize-y focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
            {content !== originalContent && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full" />
                Content modified
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 border border-navy-200 rounded-lg text-sm text-navy-800 resize-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>

          {/* Reviewed checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(e) => setReviewed(e.target.checked)}
              className="w-4 h-4 rounded border-navy-300 text-gold focus:ring-gold"
            />
            <CheckSquare className="h-4 w-4 text-navy-500" />
            <span className="text-sm text-navy-700">Mark as Reviewed</span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-navy-100">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <div className="flex-1" />
            <Button
              variant="secondary"
              onClick={handleRevert}
              disabled={!hasChanges}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Revert to Original
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving || !hasChanges}
            >
              {saving ? <Spinner size="sm" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Sidebar - Metadata (read-only) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-navy-600 uppercase tracking-wider mb-4">
              Metadata
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-navy-500">Author</dt>
                <dd className="text-sm font-medium text-navy-800">
                  {article.author?.full_name ?? 'Unknown'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-navy-500">Category</dt>
                <dd className="text-sm text-navy-800">
                  {article.category?.name ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-navy-500">Language</dt>
                <dd className="text-sm text-navy-800">
                  {article.language === 'om' ? 'Afaan Oromoo' : 'English'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-navy-500">Created</dt>
                <dd className="text-sm text-navy-800">{formatDate(article.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-500">Last Updated</dt>
                <dd className="text-sm text-navy-800">{formatDate(article.updated_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-500">Views</dt>
                <dd className="text-sm text-navy-800">{article.view_count.toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
