# 第四阶段：状态管理与 Mock 数据 (State & Logic)

根据 [初始化开发顺序](./init-dev-order.md) 和 [PRD](../prd-zh.md)，本阶段重点在于构建应用的前端逻辑核心，包括全局状态管理、自定义 Hooks 封装以及 API Mock 数据的准备。

## 1. 目标

*   建立基于 Zustand 的全局状态管理，打通 "拍照 -> 选人设 -> 生成 -> 分享" 的核心链路。
*   封装业务逻辑到 Custom Hooks，保持组件纯粹。
*   提供逼真的 Mock 数据，解耦前后端开发，确保 UI 组件可独立展示与交互。

## 2. 状态管理设计 (Zustand Stores)

文件路径：`lib/stores/*.ts`

### 2.1 核心流程 Store (`useAppStore`)

管理用户从上传照片到生成最终图片的完整操作流。

**State 定义:**

```typescript
interface AppState {
  // 1. 照片上传阶段
  currentPhoto: string | null; // 图片的 Base64 或 Blob URL
  
  // 2. 人设选择阶段
  selectedPersonaId: string; // 当前选中的人设 ID，默认为 'cold_boss' (高冷主子)
  
  // 3. AI 生成阶段
  isGenerating: boolean;     // loading 状态
  generationError: string | null;
  
  // 4. 结果展示阶段
  generatedCaptions: string[]; // AI 生成的 3 条文案
  selectedCaptionIndex: number; // 用户当前选中的文案索引
  
  // 5. 最终合成阶段
  finalMemeImage: string | null; // 合成后的梗图
}
```

**Actions 定义:**

*   `setPhoto(phaso: string)`: 设置上传的照片，同时重置生成状态。
*   `setPersona(id: string)`: 切换人设。
*   `startGeneration()`: 标记开始生成。
*   `setGenerationResults(captions: string[])`: 写入生成结果，自动选中第一条。
*   `setGenerationError(msg: string)`: 处理错误。
*   `selectCaption(index: number)`: 用户切换文案版本。
*   `setFinalMeme(image: string)`: 保存合成图。
*   `resetFlow()`: 重置所有状态回到初始页。

### 2.2 用户与配置 Store (`useUserStore`) - (为第二阶段预留)

**State 定义:**

*   `userProfile`: 用户基本信息 (Mock)
*   `myPets`: 宠物档案列表
*   `remainingFreeQuota`: strict number; // 今日剩余免费次数

**Actions 定义:**

*   `decrementQuota()`: 扣减额度。
*   `updatePetProfile(...)`: 更新宠物信息。

## 3. 自定义 Hooks 封装 (`lib/hooks`)

将逻辑从组件中剥离，便于测试和复用。

### 3.1 `usePhotoUpload` (`lib/hooks/use-photo-upload.ts`)

**功能:**
*   处理文件输入 (`<input type="file">`) 的 change 事件。
*   验证文件类型 (JPG/PNG/HEIC) 和大小 (Max 10MB).
*   生成预览 URL (URL.createObjectURL).
*   **关键:** 自动调用 `useAppStore.getState().setPhoto`.

**API:**
```typescript
const { handleFileChange, isValid, error } = usePhotoUpload();
```

### 3.2 `useAIAnalysis` (`lib/hooks/use-ai-analysis.ts`)

**功能:**
*   负责与后端 AI 服务通信（本阶段使用 Mock）。
*   根据 `currentPhoto` 和 `selectedPersonaId` 模拟延迟返回数据。
*   处理 Loading 和 Error 状态。

**Mock 逻辑:**
*   `setTimeout` 模拟 1.5s - 3s 延迟。
*   根据人设 ID 返回预设的有趣文案 (参见 Mock 数据部分)。

### 3.3 `useMemeGenerator` (`lib/hooks/use-meme-generator.ts`)

**功能:**
*   利用 HTML5 Canvas 将图片与文字合成。
*   应用样式：字体、阴影、底部黑边/气泡、水印。
*   导出为 Data URL 下载。

## 4. Mock 数据准备 (`__mocks__`)

无需等待后端，先用假数据跑通流程。

### 4.1 人设配置 (`lib/constants/personas.ts`)

对应 PRD 3.1.2 章节。

```typescript
export const PERSONAS = [
  { id: 'cold_boss', name: '高冷总裁', icon: '🕶️', description: '愚蠢的人类...' },
  { id: 'nagging_mom', name: '碎碎念大妈', icon: '👵', description: '地没扫，饭没好...' },
  { id: 'drama_queen', name: '戏精本精', icon: '🎭', description: '生活就是舞台...' },
  // ... 其他人设
];
```

### 4.2 Mock 响应库 (`lib/mocks/ai-responses.ts`)

模拟 `POST /api/generate` 的返回。

```typescript
export const MOCK_RESPONSES = {
  'cold_boss': [
    "朕允许你摸了吗？",
    "在这个家里，我才是老大。",
    "看什么看，还不去铲屎？"
  ],
  'nagging_mom': [
    "都几点了还不回家？",
    "这是人吃的猫粮吗？太硬了！",
    "你看隔壁小花，多听话。"
  ],
  // 错误场景 Mock
  'error_no_pet': "未检测到宠物，请上传包含猫/狗的照片。"
};
```

## 5. 开发任务清单

1.  **依赖安装:**
    *   `npm install zustand clsx tailwind-merge`
2.  **实现 `useAppStore`:**
    *   创建 `lib/stores/use-app-store.ts`。
    *   确保类型严谨。
3.  **实现 Mock 逻辑:**
    *   创建常量文件。
    *   编写 `verify-mock-data.ts` 脚本测试数据结构。
4.  **Hook 开发与测试:**
    *   编写 `usePhotoUpload` 并用简单的 input 测试。
    *   编写 `useAIAnalysis` 并验证状态切换 (Idle -> Loading -> Success)。

**完成后产出:**
整个应用的数据流应当跑通。虽然界面可能还很简陋（使用 Phase 3 的原子组件），但点击"生成"按钮应当能触发 Loading，并在 2 秒后更新 Store 中的文案数据。
