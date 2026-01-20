import { useCallback } from 'react';
import { useAppStore } from '@/lib/stores/use-app-store';
import Konva from 'konva';

export function useMemeGenerator() {
  const setFinalMeme = useAppStore(state => state.setFinalMeme);

  const generateMeme = useCallback((stage: Konva.Stage | null) => {
    if (!stage) return null;

    try {
      const dataUrl = stage.toDataURL({
        pixelRatio: 2 // High resolution
      });
      
      setFinalMeme(dataUrl);
      return dataUrl;
    } catch (err) {
      console.error('Failed to generate meme:', err);
      return null;
    }
  }, [setFinalMeme]);
  
  const downloadMeme = useCallback((dataUrl: string, filename = 'meme-petsoul.png') => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }, []);

  return { generateMeme, downloadMeme };
}
