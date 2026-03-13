import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please use JPG, PNG, or WebP.';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const uploadFile = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      // Simulate progress (Supabase doesn't expose upload progress natively)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file, { contentType: file.type });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      setProgress(100);
      onChange(urlData.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [onChange]);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    onChange('');
  };

  if (value) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-navy-200 bg-navy-50">
        <img
          src={value}
          alt="Cover preview"
          className="w-full h-48 object-cover"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
          title="Remove image"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors
        ${isDragging
          ? 'border-gold bg-gold/5'
          : 'border-navy-300 bg-navy-50/50 hover:border-navy-400'
        }
        ${uploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'}
      `}
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {uploading ? (
        <div className="w-full max-w-xs space-y-3">
          <div className="flex items-center justify-center">
            <Upload className="h-8 w-8 text-navy-400 animate-pulse" />
          </div>
          <p className="text-sm text-navy-600 text-center">Uploading...</p>
          <div className="w-full h-2 bg-navy-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-navy-500 text-center">{progress}%</p>
        </div>
      ) : (
        <>
          <ImageIcon className="h-10 w-10 text-navy-400 mb-3" />
          <p className="text-sm text-navy-600 mb-1">
            <span className="font-medium text-navy-800">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-navy-500">
            JPG, PNG or WebP (max {MAX_SIZE_MB}MB)
          </p>
        </>
      )}
    </div>
  );
}
