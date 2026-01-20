import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePhotoUpload } from './use-photo-upload';
import { useAppStore } from '@/lib/stores/use-app-store';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  }
}));

// Mock URL.createObjectURL
const mockCreateObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;

describe('usePhotoUpload', () => {
  beforeEach(() => {
    useAppStore.getState().resetFlow();
    mockCreateObjectURL.mockReset();
    mockCreateObjectURL.mockReturnValue('blob:url');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle valid file upload', async () => {
    const { result } = renderHook(() => usePhotoUpload());
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const event = {
      target: {
        files: [file]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleFileChange(event);
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBeNull();
    expect(useAppStore.getState().currentPhoto).toBe('blob:url');
    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
  });

  it('should reject invalid file type', async () => {
    const { result } = renderHook(() => usePhotoUpload());
    
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const event = {
      target: {
        files: [file]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleFileChange(event);
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toContain('不支持的文件格式');
    expect(useAppStore.getState().currentPhoto).toBeNull();
  });

  it('should reject large files', async () => {
    const { result } = renderHook(() => usePhotoUpload());
    
    // 11MB file
    const largeFile = {
        name: 'large.png',
        type: 'image/png',
        size: 11 * 1024 * 1024
    };
    
    const event = {
      target: {
        files: [largeFile]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleFileChange(event);
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toContain('图片大小超过 10MB 限制');
    expect(useAppStore.getState().currentPhoto).toBeNull();
  });
});
