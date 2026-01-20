import { useState, useCallback, ChangeEvent } from 'react';
import { useAppStore } from '@/lib/stores/use-app-store';
import { toast } from 'sonner';

interface UsePhotoUploadResult {
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  isValid: boolean;
  error: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];

export function usePhotoUpload(): UsePhotoUploadResult {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setPhoto = useAppStore((state) => state.setPhoto);

  const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setIsValid(false);

    if (!file) return;

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      const msg = '不支持的文件格式。请上传 JPG, PNG, HEIC 或 WebP。';
      setError(msg);
      toast.error(msg);
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      const msg = '图片大小超过 10MB 限制。';
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      // Create Object URL
      const objectUrl = URL.createObjectURL(file);
      setPhoto(objectUrl);
      setIsValid(true);
    } catch (err) {
      console.error('File processing error:', err);
      const msg = '图片处理失败，请重试。';
      setError(msg);
      toast.error(msg);
    }
  }, [setPhoto]);

  return { handleFileChange, isValid, error };
}
