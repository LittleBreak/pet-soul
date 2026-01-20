import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMemeGenerator } from './use-meme-generator';
import { useAppStore } from '@/lib/stores/use-app-store';
import Konva from 'konva';

describe('useMemeGenerator', () => {
  beforeEach(() => {
    useAppStore.getState().resetFlow();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generateMeme', () => {
    it('should return null if stage is null', () => {
      const { result } = renderHook(() => useMemeGenerator());
      const output = result.current.generateMeme(null);
      expect(output).toBeNull();
    });

    it('should generate data URL and set it to store', () => {
      const mockToDataURL = vi.fn().mockReturnValue('data:image/png;base64,test');
      const mockStage = {
        toDataURL: mockToDataURL,
      } as unknown as Konva.Stage;

      const { result } = renderHook(() => useMemeGenerator());
      
      let output;
      act(() => {
        output = result.current.generateMeme(mockStage);
      });

      expect(mockToDataURL).toHaveBeenCalledWith({ pixelRatio: 2 });
      expect(output).toBe('data:image/png;base64,test');
      expect(useAppStore.getState().finalMemeImage).toBe('data:image/png;base64,test');
    });

    it('should handle errors during generation', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const mockStage = {
            toDataURL: vi.fn().mockImplementation(() => {
                throw new Error('Canvas error');
            }),
        } as unknown as Konva.Stage;

        const { result } = renderHook(() => useMemeGenerator());
        
        let output;
        act(() => {
            output = result.current.generateMeme(mockStage);
        });

        expect(output).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith('Failed to generate meme:', expect.any(Error));
        
        consoleSpy.mockRestore();
    });
  });

  describe('downloadMeme', () => {
    it('should create link and trigger download', () => {
      const { result } = renderHook(() => useMemeGenerator());
      
      const mockLink = document.createElement('a');
      vi.spyOn(mockLink, 'click').mockImplementation(() => {});
      
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

      act(() => {
        result.current.downloadMeme('data:image/png;base64,test', 'test-meme.png');
      });

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.href).toContain('data:image/png;base64,test');
      expect(mockLink.download).toBe('test-meme.png');
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should use default filename if not provided', () => {
        const { result } = renderHook(() => useMemeGenerator());
        
        const mockLink = document.createElement('a');
        vi.spyOn(mockLink, 'click').mockImplementation(() => {});
        vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
        const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
        const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
        
        act(() => {
            result.current.downloadMeme('data:image/png;base64,test');
        });

        expect(mockLink.download).toBe('meme-petsoul.png');

        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    });
  });
});
