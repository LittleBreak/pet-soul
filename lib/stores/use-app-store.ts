import { create } from 'zustand';
import { PersonaId } from '@/types';
import { DEFAULT_PERSONA_ID } from '@/lib/constants/personas';

export type CreationStep = 'upload' | 'persona' | 'result';

interface AppState {
  // 0. 全局状态
  step: CreationStep;

  // 1. 照片上传阶段
  currentPhoto: string | null; // 图片的 Base64 或 Blob URL
  
  // 2. 人设选择阶段
  selectedPersonaId: PersonaId; // 当前选中的人设 ID
  
  // 3. AI 生成阶段
  isGenerating: boolean;     // loading 状态
  generationError: string | null;
  
  // 4. 结果展示阶段
  generatedCaptions: string[]; // AI 生成的 3 条文案
  selectedCaptionIndex: number; // 用户当前选中的文案索引
  
  // 5. 最终合成阶段
  finalMemeImage: string | null; // 合成后的梗图
}

interface AppActions {
  setStep: (step: CreationStep) => void;
  setPhoto: (photo: string) => void;
  setPersona: (id: PersonaId) => void;
  startGeneration: () => void;
  setGenerationResults: (captions: string[]) => void;
  setGenerationError: (msg: string) => void;
  selectCaption: (index: number) => void;
  setFinalMeme: (image: string) => void;
  resetFlow: () => void;
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  step: 'upload',
  currentPhoto: null,
  selectedPersonaId: DEFAULT_PERSONA_ID,
  isGenerating: false,
  generationError: null,
  generatedCaptions: [],
  selectedCaptionIndex: 0,
  finalMemeImage: null,

  setStep: (step) => set({ step }),

  setPhoto: (photo) => set({ 
    currentPhoto: photo,
    step: 'persona', // Auto-advance
    // Reset generation state when new photo is set
    isGenerating: false,
    generationError: null,
    generatedCaptions: [],
    selectedCaptionIndex: 0,
    finalMemeImage: null
  }),

  setPersona: (id) => set({ selectedPersonaId: id }),

  startGeneration: () => set({ 
    isGenerating: true, 
    generationError: null,
    generatedCaptions: [],
    selectedCaptionIndex: 0
  }),

  setGenerationResults: (captions) => set({ 
    isGenerating: false, 
    generatedCaptions: captions,
    selectedCaptionIndex: 0,
    step: 'result' // Auto-advance
  }),

  setGenerationError: (msg) => set({ 
    isGenerating: false, 
    generationError: msg 
  }),

  selectCaption: (index) => set({ selectedCaptionIndex: index }),

  setFinalMeme: (image) => set({ finalMemeImage: image }),

  resetFlow: () => set({
    step: 'upload',
    currentPhoto: null,
    selectedPersonaId: DEFAULT_PERSONA_ID,
    isGenerating: false,
    generationError: null,
    generatedCaptions: [],
    selectedCaptionIndex: 0,
    finalMemeImage: null
  })
}));