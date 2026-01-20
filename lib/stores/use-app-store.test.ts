import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './use-app-store';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.getState().resetFlow();
  });

  it('should initialize with default values', () => {
    const state = useAppStore.getState();
    expect(state.currentPhoto).toBeNull();
    expect(state.selectedPersonaId).toBe('aloof-boss'); // Default ID
    expect(state.isGenerating).toBe(false);
  });

  it('should set photo', () => {
    useAppStore.getState().setPhoto('base64:image');
    expect(useAppStore.getState().currentPhoto).toBe('base64:image');
  });

  it('should set persona', () => {
    useAppStore.getState().setPersona('hot-blooded');
    expect(useAppStore.getState().selectedPersonaId).toBe('hot-blooded');
  });

  it('should handle generation flow', () => {
    useAppStore.getState().startGeneration();
    expect(useAppStore.getState().isGenerating).toBe(true);

    const captions = ['Caption 1', 'Caption 2'];
    useAppStore.getState().setGenerationResults(captions);
    
    const state = useAppStore.getState();
    expect(state.isGenerating).toBe(false);
    expect(state.generatedCaptions).toEqual(captions);
    expect(state.selectedCaptionIndex).toBe(0);
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
    expect(state.currentPhoto).toBeNull();
    expect(state.selectedPersonaId).toBe('aloof-boss');
    expect(state.isGenerating).toBe(false);
  });
});
