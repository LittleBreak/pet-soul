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
  /** 手动设置当前步骤 */
  setStep: (step: CreationStep) => void;
  /** 设置照片并自动跳转到人设选择步骤，同时重置生成相关状态 */
  setPhoto: (photo: string) => void;
  /** 设置当前选中的人设 ID */
  setPersona: (id: PersonaId) => void;
  /** 开始 AI 生成，设置 loading 状态并清空之前的结果 */
  startGeneration: () => void;
  /** 设置生成结果并自动跳转到结果展示步骤 */
  setGenerationResults: (captions: string[]) => void;
  /** 设置生成错误信息并结束 loading 状态 */
  setGenerationError: (msg: string) => void;
  /** 选择用户当前查看的文案索引 */
  selectCaption: (index: number) => void;
  /** 设置最终合成的梗图 */
  setFinalMeme: (image: string) => void;
  /** 重置整个流程到初始状态 */
  resetFlow: () => void;
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  // ============ 初始状态 ============
  step: 'upload',
  currentPhoto: null,
  selectedPersonaId: DEFAULT_PERSONA_ID,
  isGenerating: false,
  generationError: null,
  generatedCaptions: [],
  selectedCaptionIndex: 0,
  finalMemeImage: null,

  // ============ Actions ============

  /**
   * 手动设置当前步骤
   * 通常用于导航返回等场景
   */
  setStep: (step) => set({ step }),

  /**
   * 设置用户上传的照片
   * - 自动跳转到人设选择步骤 (persona)
   * - 重置所有生成相关的状态，确保新照片有干净的初始状态
   */
  setPhoto: (photo) => set({ 
    currentPhoto: photo,
    step: 'persona',
    isGenerating: false,
    generationError: null,
    generatedCaptions: [],
    selectedCaptionIndex: 0,
    finalMemeImage: null
  }),

  /**
   * 设置当前选中的人设 ID
   * 用于人设选择步骤中用户切换人设
   */
  setPersona: (id) => set({ selectedPersonaId: id }),

  /**
   * 开始 AI 生成流程
   * - 设置 loading 状态为 true
   * - 清空错误信息和之前的生成结果
   * - 重置文案选择索引
   */
  startGeneration: () => set({ 
    isGenerating: true, 
    generationError: null,
    generatedCaptions: [],
    selectedCaptionIndex: 0
  }),

  /**
   * 设置 AI 生成的文案结果
   * - 结束 loading 状态
   * - 存储生成的文案数组
   * - 默认选中第一条文案
   * - 自动跳转到结果展示步骤 (result)
   */
  setGenerationResults: (captions) => set({ 
    isGenerating: false, 
    generatedCaptions: captions,
    selectedCaptionIndex: 0,
    step: 'result'
  }),

  /**
   * 设置生成错误信息
   * - 结束 loading 状态
   * - 存储错误信息供 UI 展示
   */
  setGenerationError: (msg) => set({ 
    isGenerating: false, 
    generationError: msg 
  }),

  /**
   * 选择当前查看/编辑的文案
   * 用于结果轮播组件中用户切换不同文案
   */
  selectCaption: (index) => set({ selectedCaptionIndex: index }),

  /**
   * 设置最终合成的梗图
   * 存储合成后的图片 URL/Base64，用于导出和分享
   */
  setFinalMeme: (image) => set({ finalMemeImage: image }),

  /**
   * 重置整个创作流程
   * 将所有状态恢复到初始值，通常用于：
   * - 用户点击"重新开始"
   * - 完成分享后重新创作
   */
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