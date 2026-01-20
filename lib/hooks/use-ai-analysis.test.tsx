import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAIAnalysis } from './use-ai-analysis';
import { useAppStore } from '@/lib/stores/use-app-store';
import { toast } from 'sonner';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('useAIAnalysis', () => {
  beforeEach(() => {
    useAppStore.getState().resetFlow();
    vi.useFakeTimers();
    // Default mock for Math.random to ensure success (>= 0.1)
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should show error toast if no photo is uploaded', async () => {
    const { result } = renderHook(() => useAIAnalysis());

    await act(async () => {
      await result.current.generateMemeText();
    });

    expect(toast.error).toHaveBeenCalledWith('请先上传照片');
    expect(useAppStore.getState().isGenerating).toBe(false);
  });

  it('should successfully generate meme text', async () => {
    // Setup store with photo
    act(() => {
      useAppStore.getState().setPhoto('test-photo');
    });

    const { result } = renderHook(() => useAIAnalysis());

    let promise: Promise<void>;
    await act(async () => {
      promise = result.current.generateMemeText();
    });
    
    expect(useAppStore.getState().isGenerating).toBe(true);

    // Fast-forward time
    await act(async () => {
        await vi.runAllTimersAsync();
    });
    
    await act(async () => {
        await promise!;
    });

    expect(useAppStore.getState().isGenerating).toBe(false);
    expect(toast.success).toHaveBeenCalledWith('生成成功！');
    expect(useAppStore.getState().generatedCaptions.length).toBeGreaterThan(0);
    expect(useAppStore.getState().generationError).toBeNull();
  });

  it('should handle AI service error (simulated random failure)', async () => {
    // Force failure
    vi.spyOn(Math, 'random').mockReturnValue(0.05);

    act(() => {
      useAppStore.getState().setPhoto('test-photo');
    });

    const { result } = renderHook(() => useAIAnalysis());

    let promise: Promise<void>;
    await act(async () => {
      promise = result.current.generateMemeText();
    });

    await act(async () => {
        await vi.runAllTimersAsync();
    });

    await act(async () => {
        await promise!;
    });

    expect(useAppStore.getState().isGenerating).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('AI 服务繁忙，请稍后重试');
    expect(useAppStore.getState().generationError).toBe('AI 服务繁忙，请稍后重试');
  });

  it('should handle missing persona response', async () => {
     act(() => {
      useAppStore.getState().setPhoto('test-photo');
      // Set a persona ID that doesn't exist in mocks (assuming 'unknown-persona' doesn't exist)
      // Note: We might need to strictly type this if the store enforces specific strings, 
      // but purely JS/TSwise here it should pass strings.
      // If the store is typed to specific unions, we might need to cast or rely on the fact 
      // that MOCK_RESPONSES access returns undefined.
      useAppStore.getState().setPersona('unknown-persona' as any);
    });

    const { result } = renderHook(() => useAIAnalysis());

    let promise: Promise<void>;
    await act(async () => {
      promise = result.current.generateMemeText();
    });

    await act(async () => {
        await vi.runAllTimersAsync();
    });

    await act(async () => {
        await promise!;
    });

    expect(useAppStore.getState().generationError).toBe('生成失败: 未找到对应的文案');
    expect(toast.error).toHaveBeenCalledWith('生成失败: 未找到对应的文案');
  });
});
