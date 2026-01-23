import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './use-app-store';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.getState().resetFlow();
  });

  it('should initialize with default values', () => {
    const state = useAppStore.getState();
    expect(state.step).toBe('upload');
    expect(state.currentPhoto).toBeNull();
    expect(state.selectedPersonaId).toBe('aloof-boss'); // Default ID
    expect(state.isGenerating).toBe(false);
  });

  it('should set photo and advance step', () => {
    useAppStore.getState().setPhoto('base64:image');
    expect(useAppStore.getState().currentPhoto).toBe('base64:image');
    expect(useAppStore.getState().step).toBe('persona');
  });

  it('should set persona', () => {
    useAppStore.getState().setPersona('hot-blooded');
    expect(useAppStore.getState().selectedPersonaId).toBe('hot-blooded');
  });

  it('should handle generation flow and advance step', () => {
    useAppStore.getState().startGeneration();
    expect(useAppStore.getState().isGenerating).toBe(true);

    const captions = ['Caption 1', 'Caption 2'];
    useAppStore.getState().setGenerationResults(captions);
    
    const state = useAppStore.getState();
    expect(state.isGenerating).toBe(false);
    expect(state.generatedCaptions).toEqual(captions);
    expect(state.selectedCaptionIndex).toBe(0);
    expect(state.step).toBe('result');
  });

  it('should set generation error', () => {
    useAppStore.getState().startGeneration();
    useAppStore.getState().setGenerationError('Failed');
    
    const state = useAppStore.getState();
    expect(state.isGenerating).toBe(false);
    expect(state.generationError).toBe('Failed');
  });

  it('should select caption', () => {
    useAppStore.getState().setGenerationResults(['A', 'B', 'C']);
    useAppStore.getState().selectCaption(1);
    expect(useAppStore.getState().selectedCaptionIndex).toBe(1);
  });

  it('should set final meme', () => {
    useAppStore.getState().setFinalMeme('meme-url');
    expect(useAppStore.getState().finalMemeImage).toBe('meme-url');
  });

  it('should reset flow', () => {
    useAppStore.getState().setPhoto('photo');
    useAppStore.getState().setPersona('hot-blooded');
    useAppStore.getState().startGeneration();
    
    useAppStore.getState().resetFlow();
    
    const state = useAppStore.getState();
    expect(state.step).toBe('upload');
    expect(state.currentPhoto).toBeNull();
    expect(state.selectedPersonaId).toBe('aloof-boss');
    expect(state.isGenerating).toBe(false);
  });
  
  it('should allow manual step change', () => {
    useAppStore.getState().setStep('persona');
    expect(useAppStore.getState().step).toBe('persona');
  });

  it('should reset generation state when setting new photo', () => {
    useAppStore.getState().setGenerationResults(['old caption']);
    useAppStore.getState().setFinalMeme('old-meme');
    useAppStore.getState().setPhoto('new-photo');
    
    const state = useAppStore.getState();
    expect(state.generatedCaptions).toEqual([]);
    expect(state.finalMemeImage).toBeNull();
    expect(state.isGenerating).toBe(false);
    expect(state.generationError).toBeNull();
  });

  it('should complete full creation flow', () => {
    const store = useAppStore.getState();
    store.setPhoto('photo-data');
    store.setPersona('hot-blooded');
    store.startGeneration();
    store.setGenerationResults(['A', 'B', 'C']);
    store.selectCaption(2);
    store.setFinalMeme('final-meme');
    
    const state = useAppStore.getState();
    expect(state.step).toBe('result');
    expect(state.currentPhoto).toBe('photo-data');
    expect(state.selectedPersonaId).toBe('hot-blooded');
    expect(state.generatedCaptions).toEqual(['A', 'B', 'C']);
    expect(state.selectedCaptionIndex).toBe(2);
    expect(state.finalMemeImage).toBe('final-meme');
  });

  it('should recover from generation error', () => {
    useAppStore.getState().startGeneration();
    useAppStore.getState().setGenerationError('Network error');
    
    expect(useAppStore.getState().generationError).toBe('Network error');
    expect(useAppStore.getState().isGenerating).toBe(false);
    
    // 重试生成
    useAppStore.getState().startGeneration();
    
    expect(useAppStore.getState().generationError).toBeNull();
    expect(useAppStore.getState().isGenerating).toBe(true);
  });

  it('should handle selectCaption with different indices', () => {
    useAppStore.getState().setGenerationResults(['A', 'B', 'C', 'D']);
    
    useAppStore.getState().selectCaption(0);
    expect(useAppStore.getState().selectedCaptionIndex).toBe(0);
    
    useAppStore.getState().selectCaption(3);
    expect(useAppStore.getState().selectedCaptionIndex).toBe(3);
  });
});