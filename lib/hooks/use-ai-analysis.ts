import { useCallback } from 'react';
import { useAppStore } from '@/lib/stores/use-app-store';
import { MOCK_RESPONSES } from '@/lib/mocks/ai-responses';
import { toast } from 'sonner';

export function useAIAnalysis() {
  const currentPhoto = useAppStore(state => state.currentPhoto);
  const selectedPersonaId = useAppStore(state => state.selectedPersonaId);
  const startGeneration = useAppStore(state => state.startGeneration);
  const setGenerationResults = useAppStore(state => state.setGenerationResults);
  const setGenerationError = useAppStore(state => state.setGenerationError);

  const generateMemeText = useCallback(async () => {
    if (!currentPhoto) {
      toast.error('请先上传照片');
      return;
    }

    startGeneration();

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 10% chance of failure (simulated)
      if (Math.random() < 0.1) {
        throw new Error('AI 服务繁忙，请稍后重试');
      }

      const responses = MOCK_RESPONSES[selectedPersonaId];
      
      if (Array.isArray(responses)) {
        setGenerationResults(responses);
        toast.success('生成成功！');
      } else {
        // Fallback or error if mock data is missing
        setGenerationError('生成失败: 未找到对应的文案');
        toast.error('生成失败: 未找到对应的文案');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : '未知错误';
      setGenerationError(msg);
      toast.error(msg);
    }
  }, [currentPhoto, selectedPersonaId, startGeneration, setGenerationResults, setGenerationError]);

  return { generateMemeText };
}
