# 前端实现指南：宠灵感 · PetSoul

| **属性** | **详情** |
| --- | --- |
| **状态** | `草稿` |
| **最后更新** | 2026-01-19 |

---

## 执行概览

```
阶段一：基础设施搭建 ──────────────────────────────► 完成基础配置
    │
    ▼
阶段二：核心 UI 组件 ─────────────────────────────► 可复用组件库
    │
    ▼
阶段三：图片上传功能 ─────────────────────────────► FR.1.1 完成
    │
    ▼
阶段四：人设选择功能 ─────────────────────────────► FR.2.x 完成
    │
    ▼
阶段五：AI 生成集成 ──────────────────────────────► FR.1.2-1.5 完成
    │
    ▼
阶段六：梗图编辑器 ───────────────────────────────► FR.3.x 完成
    │
    ▼
阶段七：分享功能 ─────────────────────────────────► FR.4.x 完成
    │
    ▼
阶段八：PWA 与优化 ───────────────────────────────► MVP 完成
```

---

## 阶段一：基础设施搭建

### 步骤 1.1：安装核心依赖

```bash
# UI 组件
pnpm add @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-toast @radix-ui/react-tooltip

# 动画和交互
pnpm add framer-motion swiper lucide-react

# 状态管理
pnpm add zustand @tanstack/react-query

# 表单和验证
pnpm add react-hook-form zod @hookform/resolvers

# 样式工具
pnpm add clsx tailwind-merge
```

### 步骤 1.2：创建目录结构

```bash
mkdir -p components/{ui,upload,persona,result,meme,share,layout}
mkdir -p lib/{api,hooks,stores,utils,constants,validations}
mkdir -p types
mkdir -p public/{fonts,icons,images}
```

### 步骤 1.3：配置工具函数

**创建 `lib/utils/cn.ts`：**

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 步骤 1.4：配置 QueryClient Provider

**创建 `components/providers.tsx`：**

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**更新 `app/layout.tsx`：**

```typescript
import { Providers } from '@/components/providers';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**✅ 检查点：** 运行 `pnpm dev`，确保无报错

---

## 阶段二：核心 UI 组件

### 步骤 2.1：Button 组件

**创建 `components/ui/button.tsx`：**

```typescript
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-colors',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-indigo-600 text-white hover:bg-indigo-700': variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
            'hover:bg-gray-100': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 步骤 2.2：Card 组件

**创建 `components/ui/card.tsx`：**

```typescript
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-white rounded-2xl shadow-sm border border-gray-100', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('px-4 py-3 border-b border-gray-100', className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('p-4', className)} {...props} />;
}
```

### 步骤 2.3：Toast 通知组件

**创建 `lib/stores/toast-store.ts`：**

```typescript
import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  add: (toast: Omit<Toast, 'id'>) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string) => useToastStore.getState().add({ type: 'success', message }),
  error: (message: string) => useToastStore.getState().add({ type: 'error', message }),
  info: (message: string) => useToastStore.getState().add({ type: 'info', message }),
};
```

**创建 `components/ui/toaster.tsx`：**

```typescript
'use client';

import { useToastStore } from '@/lib/stores/toast-store';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'p-4 rounded-xl shadow-lg flex items-center justify-between animate-slide-up',
            {
              'bg-green-50 text-green-800': toast.type === 'success',
              'bg-red-50 text-red-800': toast.type === 'error',
              'bg-blue-50 text-blue-800': toast.type === 'info',
            }
          )}
        >
          <span>{toast.message}</span>
          <button onClick={() => remove(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 步骤 2.4：Skeleton 加载组件

**创建 `components/ui/skeleton.tsx`：**

```typescript
import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded-lg', className)} />
  );
}
```

### 步骤 2.5：导出所有 UI 组件

**创建 `components/ui/index.ts`：**

```typescript
export * from './button';
export * from './card';
export * from './skeleton';
export * from './toaster';
```

**✅ 检查点：** 在首页测试 Button 和 Toast 组件

---

## 阶段三：图片上传功能

### 步骤 3.1：安装图片处理依赖

```bash
pnpm add react-dropzone browser-image-compression heic2any
pnpm add -D @types/heic2any
```

### 步骤 3.2：创建图片处理工具

**创建 `lib/utils/image.ts`：**

```typescript
import imageCompression from 'browser-image-compression';

export const IMAGE_CONFIG = {
  maxSizeMB: 10,
  compressTargetMB: 1,
  maxWidthOrHeight: 2048,
};

export function detectImageFormat(file: File): 'jpeg' | 'png' | 'heic' | 'unknown' {
  const type = file.type.toLowerCase();
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpeg';
  if (type.includes('png')) return 'png';
  if (type.includes('heic') || type.includes('heif')) return 'heic';

  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'heic' || ext === 'heif') return 'heic';

  return 'unknown';
}

export async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default;
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
  const resultBlob = Array.isArray(blob) ? blob[0] : blob;
  return new File([resultBlob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
}

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: IMAGE_CONFIG.compressTargetMB,
    maxWidthOrHeight: IMAGE_CONFIG.maxWidthOrHeight,
    useWebWorker: true,
  });
}

export async function processImage(file: File): Promise<{ file: File; preview: string }> {
  const format = detectImageFormat(file);
  if (format === 'unknown') {
    throw new Error('不支持的图片格式');
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > IMAGE_CONFIG.maxSizeMB) {
    throw new Error(`图片过大，请上传小于 ${IMAGE_CONFIG.maxSizeMB}MB 的图片`);
  }

  let processed = file;

  if (format === 'heic') {
    processed = await convertHeicToJpeg(file);
  }

  if (processed.size > IMAGE_CONFIG.compressTargetMB * 1024 * 1024) {
    processed = await compressImage(processed);
  }

  const preview = URL.createObjectURL(processed);
  return { file: processed, preview };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

### 步骤 3.3：创建 Upload Store

**创建 `lib/stores/upload-store.ts`：**

```typescript
import { create } from 'zustand';

interface UploadState {
  file: File | null;
  preview: string | null;
  base64: string | null;
  personaId: string;
  step: 'upload' | 'persona' | 'generating' | 'result';

  setFile: (file: File, preview: string) => void;
  setBase64: (base64: string) => void;
  setPersona: (id: string) => void;
  setStep: (step: UploadState['step']) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  file: null,
  preview: null,
  base64: null,
  personaId: 'cold-boss',
  step: 'upload',

  setFile: (file, preview) => set({ file, preview, step: 'persona' }),
  setBase64: (base64) => set({ base64 }),
  setPersona: (id) => set({ personaId: id }),
  setStep: (step) => set({ step }),
  reset: () => set({ file: null, preview: null, base64: null, personaId: 'cold-boss', step: 'upload' }),
}));
```

### 步骤 3.4：创建 PhotoUploader 组件

**创建 `components/upload/photo-uploader.tsx`：**

```typescript
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, ImagePlus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { processImage, fileToBase64 } from '@/lib/utils/image';
import { useUploadStore } from '@/lib/stores/upload-store';
import { toast } from '@/lib/stores/toast-store';

export function PhotoUploader() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setFile, setBase64 } = useUploadStore();

  const handleFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const { file: processed, preview } = await processImage(file);
      setFile(processed, preview);

      const base64 = await fileToBase64(processed);
      setBase64(base64);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '图片处理失败');
    } finally {
      setIsProcessing(false);
    }
  }, [setFile, setBase64]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.heic', '.heif'] },
    maxFiles: 1,
    onDrop: (files) => files[0] && handleFile(files[0]),
  });

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="mt-2 text-gray-500">处理中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 拖拽上传区 */}
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-colors',
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
        )}
      >
        <input {...getInputProps()} />
        <ImagePlus className="w-12 h-12 text-gray-400" />
        <p className="mt-2 text-gray-600">点击或拖拽上传宠物照片</p>
        <p className="text-sm text-gray-400">支持 JPG、PNG、HEIC 格式</p>
      </div>

      {/* 拍照按钮 */}
      <label className="flex items-center justify-center gap-2 h-12 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors">
        <Camera size={20} />
        <span>拍照</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCameraCapture}
        />
      </label>
    </div>
  );
}
```

### 步骤 3.5：创建 ImagePreview 组件

**创建 `components/upload/image-preview.tsx`：**

```typescript
'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useUploadStore } from '@/lib/stores/upload-store';
import { Button } from '@/components/ui/button';

export function ImagePreview() {
  const { preview, reset } = useUploadStore();

  if (!preview) return null;

  return (
    <div className="relative">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
        <Image src={preview} alt="预览" fill className="object-cover" />
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-2 right-2"
        onClick={reset}
      >
        <X size={16} />
      </Button>
    </div>
  );
}
```

**✅ 检查点：** 测试上传 JPG/PNG/HEIC 图片，验证压缩和预览功能

---

## 阶段四：人设选择功能

### 步骤 4.1：定义人设配置

**创建 `lib/constants/personas.ts`：**

```typescript
export interface Persona {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompt: string;
  isPremium: boolean;
}

export const PERSONAS: Persona[] = [
  {
    id: 'cold-boss',
    name: '高冷总裁',
    icon: '👔',
    description: '冷漠、高傲、一切尽在掌控',
    prompt: '用高冷总裁的语气，傲慢且不屑，偶尔流露出对铲屎官的嫌弃',
    isPremium: false,
  },
  {
    id: 'chatty-auntie',
    name: '碎碎念大妈',
    icon: '👵',
    description: '话多、热心、操心一切',
    prompt: '用碎碎念大妈的语气，絮絮叨叨，关心所有细节，喜欢八卦',
    isPremium: false,
  },
  {
    id: 'artistic-youth',
    name: '文艺青年',
    icon: '🎨',
    description: '感性、浪漫、充满诗意',
    prompt: '用文艺青年的语气，多用比喻和诗意表达，感叹生活的美好',
    isPremium: false,
  },
  {
    id: 'hot-blood',
    name: '热血少年',
    icon: '🔥',
    description: '热情、积极、充满干劲',
    prompt: '用热血少年的语气，充满激情和正能量，喜欢用感叹号',
    isPremium: false,
  },
  {
    id: 'sarcastic',
    name: '毒舌吐槽',
    icon: '😏',
    description: '犀利、毒舌、一针见血',
    prompt: '用毒舌吐槽的语气，犀利地点评，带有讽刺和幽默',
    isPremium: false,
  },
  {
    id: 'humble-worker',
    name: '卑微打工人',
    icon: '💼',
    description: '疲惫、无奈、社畜日常',
    prompt: '用卑微打工人的语气，充满无奈和自嘲，渴望躺平',
    isPremium: false,
  },
  // 高级人设
  {
    id: 'zhenhuan',
    name: '甄嬛体',
    icon: '👑',
    description: '宫斗、阴阳、步步为营',
    prompt: '用甄嬛传的语气，阴阳怪气，暗藏心机，喜欢说"本宫"',
    isPremium: true,
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    icon: '🤖',
    description: '科技、未来、机械感',
    prompt: '用赛博朋克风格，夹杂英文和科技术语，充满未来感',
    isPremium: true,
  },
];
```

### 步骤 4.2：创建 PersonaCard 组件

**创建 `components/persona/persona-card.tsx`：**

```typescript
'use client';

import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Persona } from '@/lib/constants/personas';

interface PersonaCardProps {
  persona: Persona;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: () => void;
}

export function PersonaCard({ persona, isSelected, isLocked, onSelect }: PersonaCardProps) {
  return (
    <button
      onClick={onSelect}
      disabled={isLocked}
      className={cn(
        'relative flex flex-col items-center p-4 rounded-xl border-2 transition-all',
        isSelected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-100 hover:border-gray-200',
        isLocked && 'opacity-60 cursor-not-allowed'
      )}
    >
      {isLocked && (
        <div className="absolute top-2 right-2">
          <Lock size={14} className="text-gray-400" />
        </div>
      )}
      <span className="text-3xl">{persona.icon}</span>
      <span className="mt-2 font-medium text-gray-900">{persona.name}</span>
      <span className="mt-1 text-xs text-gray-500 text-center">{persona.description}</span>
    </button>
  );
}
```

### 步骤 4.3：创建 PersonaSelector 组件

**创建 `components/persona/persona-selector.tsx`：**

```typescript
'use client';

import { PERSONAS } from '@/lib/constants/personas';
import { useUploadStore } from '@/lib/stores/upload-store';
import { PersonaCard } from './persona-card';

interface PersonaSelectorProps {
  isPremiumUser?: boolean;
}

export function PersonaSelector({ isPremiumUser = false }: PersonaSelectorProps) {
  const { personaId, setPersona } = useUploadStore();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">选择宠物人设</h2>
      <div className="grid grid-cols-3 gap-3">
        {PERSONAS.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            isSelected={personaId === persona.id}
            isLocked={persona.isPremium && !isPremiumUser}
            onSelect={() => {
              if (!persona.isPremium || isPremiumUser) {
                setPersona(persona.id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

**✅ 检查点：** 测试人设选择，验证选中态和锁定态

---

## 阶段五：AI 生成集成

### 步骤 5.1：安装 AI SDK

```bash
pnpm add @anthropic-ai/sdk
```

### 步骤 5.2：定义类型和 Schema

**创建 `types/index.ts`：**

```typescript
export interface Monologue {
  id: string;
  text: string;
  tone: string;
}

export interface GenerateResult {
  monologues: Monologue[];
  petType: string;
  petBreed?: string;
  emotion: string;
}
```

**创建 `lib/validations/generate.ts`：**

```typescript
import { z } from 'zod';

export const generateRequestSchema = z.object({
  imageBase64: z.string().min(1),
  personaId: z.string().min(1),
});

export const monologueSchema = z.object({
  id: z.string(),
  text: z.string(),
  tone: z.string(),
});

export const generateResponseSchema = z.object({
  monologues: z.array(monologueSchema),
  petType: z.string(),
  petBreed: z.string().optional(),
  emotion: z.string(),
});
```

### 步骤 5.3：创建生成 API Route

**创建 `app/api/generate/route.ts`：**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { generateRequestSchema } from '@/lib/validations/generate';
import { PERSONAS } from '@/lib/constants/personas';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, personaId } = generateRequestSchema.parse(body);

    const persona = PERSONAS.find((p) => p.id === personaId);
    if (!persona) {
      return NextResponse.json({ error: '无效的人设' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `你是一个宠物内心戏生成专家。请分析这张宠物照片，然后${persona.prompt}，生成 3 个不同版本的内心独白。

要求：
1. 每个版本 30-50 字
2. 要有趣、有个性
3. 结合图片中的动作、表情、环境

请返回 JSON 格式：
{
  "petType": "猫/狗/其他",
  "petBreed": "品种（如果能识别）",
  "emotion": "情绪描述",
  "monologues": [
    { "id": "1", "text": "内心独白1", "tone": "语气描述" },
    { "id": "2", "text": "内心独白2", "tone": "语气描述" },
    { "id": "3", "text": "内心独白3", "tone": "语气描述" }
  ]
}`,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // 提取 JSON
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: '生成失败，请重试' },
      { status: 500 }
    );
  }
}
```

### 步骤 5.4：创建生成 Hook

**创建 `lib/hooks/use-generate.ts`：**

```typescript
import { useMutation } from '@tanstack/react-query';
import type { GenerateResult } from '@/types';

interface GenerateParams {
  imageBase64: string;
  personaId: string;
}

async function generateMonologues(params: GenerateParams): Promise<GenerateResult> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '生成失败');
  }

  return response.json();
}

export function useGenerate() {
  return useMutation({
    mutationFn: generateMonologues,
  });
}
```

### 步骤 5.5：创建 Result Store

**创建 `lib/stores/result-store.ts`：**

```typescript
import { create } from 'zustand';
import type { Monologue } from '@/types';

interface ResultState {
  monologues: Monologue[];
  selectedIndex: number;
  petType: string;
  emotion: string;

  setResult: (monologues: Monologue[], petType: string, emotion: string) => void;
  selectMonologue: (index: number) => void;
  reset: () => void;
}

export const useResultStore = create<ResultState>((set) => ({
  monologues: [],
  selectedIndex: 0,
  petType: '',
  emotion: '',

  setResult: (monologues, petType, emotion) =>
    set({ monologues, petType, emotion, selectedIndex: 0 }),
  selectMonologue: (index) => set({ selectedIndex: index }),
  reset: () => set({ monologues: [], selectedIndex: 0, petType: '', emotion: '' }),
}));
```

### 步骤 5.6：创建 MonologueSwiper 组件

```bash
pnpm add swiper
```

**创建 `components/result/monologue-swiper.tsx`：**

```typescript
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useResultStore } from '@/lib/stores/result-store';
import { Card, CardContent } from '@/components/ui/card';

import 'swiper/css';
import 'swiper/css/pagination';

export function MonologueSwiper() {
  const { monologues, selectedIndex, selectMonologue } = useResultStore();

  if (monologues.length === 0) return null;

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      initialSlide={selectedIndex}
      onSlideChange={(swiper) => selectMonologue(swiper.activeIndex)}
      className="w-full"
    >
      {monologues.map((monologue, index) => (
        <SwiperSlide key={monologue.id}>
          <Card className="mx-2">
            <CardContent className="p-6">
              <p className="text-lg text-gray-900 leading-relaxed">
                "{monologue.text}"
              </p>
              <p className="mt-4 text-sm text-gray-500">
                —— {monologue.tone}
              </p>
            </CardContent>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

### 步骤 5.7：创建生成页面

**创建 `app/(main)/generate/page.tsx`：**

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { ImagePreview } from '@/components/upload/image-preview';
import { PersonaSelector } from '@/components/persona/persona-selector';
import { Button } from '@/components/ui/button';
import { useUploadStore } from '@/lib/stores/upload-store';
import { useResultStore } from '@/lib/stores/result-store';
import { useGenerate } from '@/lib/hooks/use-generate';
import { toast } from '@/lib/stores/toast-store';

export default function GeneratePage() {
  const router = useRouter();
  const { base64, personaId, step, setStep } = useUploadStore();
  const { setResult } = useResultStore();
  const { mutate: generate, isPending } = useGenerate();

  const handleGenerate = () => {
    if (!base64) {
      toast.error('请先上传图片');
      return;
    }

    setStep('generating');

    generate(
      { imageBase64: base64, personaId },
      {
        onSuccess: (data) => {
          setResult(data.monologues, data.petType, data.emotion);
          setStep('result');
          router.push('/result');
        },
        onError: (error) => {
          toast.error(error.message);
          setStep('persona');
        },
      }
    );
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      <ImagePreview />
      <PersonaSelector />
      <Button
        size="lg"
        className="w-full"
        onClick={handleGenerate}
        isLoading={isPending}
      >
        生成内心戏
      </Button>
    </div>
  );
}
```

**✅ 检查点：** 完整测试上传 → 选人设 → 生成流程

---

## 阶段六：梗图编辑器

### 步骤 6.1：安装 Konva

```bash
pnpm add konva react-konva
```

### 步骤 6.2：创建 Meme Store

**创建 `lib/stores/meme-store.ts`：**

```typescript
import { create } from 'zustand';

interface MemeState {
  imageUrl: string | null;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  filter: 'none' | 'vintage' | 'blackwhite';
  showWatermark: boolean;

  setImage: (url: string) => void;
  setText: (text: string) => void;
  setFont: (font: string) => void;
  setFontSize: (size: number) => void;
  setColor: (color: string) => void;
  setFilter: (filter: MemeState['filter']) => void;
  setWatermark: (show: boolean) => void;
  reset: () => void;
}

export const useMemeStore = create<MemeState>((set) => ({
  imageUrl: null,
  text: '',
  fontFamily: 'sans-serif',
  fontSize: 24,
  color: '#FFFFFF',
  filter: 'none',
  showWatermark: true,

  setImage: (url) => set({ imageUrl: url }),
  setText: (text) => set({ text }),
  setFont: (fontFamily) => set({ fontFamily }),
  setFontSize: (fontSize) => set({ fontSize }),
  setColor: (color) => set({ color }),
  setFilter: (filter) => set({ filter }),
  setWatermark: (show) => set({ showWatermark: show }),
  reset: () => set({
    imageUrl: null,
    text: '',
    fontFamily: 'sans-serif',
    fontSize: 24,
    color: '#FFFFFF',
    filter: 'none',
    showWatermark: true,
  }),
}));
```

### 步骤 6.3：创建 MemeEditor 组件

**创建 `components/meme/meme-editor.tsx`：**

```typescript
'use client';

import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect } from 'react-konva';
import type Konva from 'konva';
import { useMemeStore } from '@/lib/stores/meme-store';

interface MemeEditorProps {
  width?: number;
  height?: number;
  onExport?: (dataUrl: string) => void;
}

export function MemeEditor({ width = 350, height = 350 }: MemeEditorProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const { imageUrl, text, fontFamily, fontSize, color, showWatermark } = useMemeStore();

  useEffect(() => {
    if (!imageUrl) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => setImage(img);
  }, [imageUrl]);

  const exportImage = () => {
    if (!stageRef.current) return null;
    return stageRef.current.toDataURL({ pixelRatio: 2, mimeType: 'image/jpeg', quality: 0.9 });
  };

  // 暴露导出方法
  useEffect(() => {
    (window as unknown as { exportMeme: typeof exportImage }).exportMeme = exportImage;
  }, []);

  return (
    <div className="bg-gray-100 rounded-xl overflow-hidden">
      <Stage ref={stageRef} width={width} height={height}>
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              width={width}
              height={height}
              // 简单适配
            />
          )}
        </Layer>
        <Layer>
          <Text
            text={text}
            x={20}
            y={height - 80}
            width={width - 40}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fill={color}
            stroke="#000000"
            strokeWidth={1}
            align="center"
          />
        </Layer>
        {showWatermark && (
          <Layer>
            <Text
              text="宠灵感"
              x={width - 70}
              y={height - 25}
              fontSize={12}
              fill="rgba(255,255,255,0.5)"
            />
          </Layer>
        )}
      </Stage>
    </div>
  );
}
```

### 步骤 6.4：创建编辑器工具栏

**创建 `components/meme/editor-toolbar.tsx`：**

```typescript
'use client';

import { useMemeStore } from '@/lib/stores/meme-store';

const FONTS = [
  { id: 'sans-serif', name: '默认' },
  { id: 'serif', name: '衬线' },
  { id: 'monospace', name: '等宽' },
];

const COLORS = ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#FFE66D'];

export function EditorToolbar() {
  const { fontFamily, color, setFont, setColor, fontSize, setFontSize } = useMemeStore();

  return (
    <div className="space-y-4 p-4">
      {/* 字体选择 */}
      <div>
        <label className="text-sm text-gray-500 mb-2 block">字体</label>
        <div className="flex gap-2">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => setFont(font.id)}
              className={`px-3 py-1 rounded-lg text-sm ${
                fontFamily === font.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100'
              }`}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* 颜色选择 */}
      <div>
        <label className="text-sm text-gray-500 mb-2 block">颜色</label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 ${
                color === c ? 'border-indigo-500' : 'border-gray-200'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* 字号调节 */}
      <div>
        <label className="text-sm text-gray-500 mb-2 block">字号: {fontSize}</label>
        <input
          type="range"
          min={16}
          max={48}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
```

**✅ 检查点：** 测试梗图编辑器，能够正常显示图片和文字

---

## 阶段七：分享功能

### 步骤 7.1：创建分享工具

**创建 `lib/utils/share.ts`：**

```typescript
export async function saveImageToDevice(dataUrl: string, filename = 'petsoul.jpg') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export async function shareImage(dataUrl: string, title: string) {
  // 转换为 Blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const file = new File([blob], 'petsoul.jpg', { type: 'image/jpeg' });

  // 使用 Web Share API
  if (navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title,
      });
      return true;
    } catch {
      // 用户取消分享
      return false;
    }
  }

  // 降级为下载
  saveImageToDevice(dataUrl);
  return true;
}

export async function copyImageToClipboard(dataUrl: string) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    return true;
  } catch {
    return false;
  }
}
```

### 步骤 7.2：创建 ShareSheet 组件

**创建 `components/share/share-sheet.tsx`：**

```typescript
'use client';

import { Download, Share2, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveImageToDevice, shareImage, copyImageToClipboard } from '@/lib/utils/share';
import { toast } from '@/lib/stores/toast-store';

interface ShareSheetProps {
  imageDataUrl: string;
  onClose: () => void;
}

export function ShareSheet({ imageDataUrl, onClose }: ShareSheetProps) {
  const handleSave = async () => {
    saveImageToDevice(imageDataUrl);
    toast.success('已保存到相册');
    onClose();
  };

  const handleShare = async () => {
    const success = await shareImage(imageDataUrl, '我的宠物内心戏');
    if (success) {
      toast.success('分享成功');
      onClose();
    }
  };

  const handleCopy = async () => {
    const success = await copyImageToClipboard(imageDataUrl);
    if (success) {
      toast.success('已复制到剪贴板');
    } else {
      toast.error('复制失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-t-2xl p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">分享</h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handleSave}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Download className="text-green-600" />
            </div>
            <span className="text-sm">保存图片</span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Share2 className="text-blue-600" />
            </div>
            <span className="text-sm">分享</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Copy className="text-purple-600" />
            </div>
            <span className="text-sm">复制</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

**✅ 检查点：** 测试保存和分享功能

---

## 阶段八：PWA 与优化

### 步骤 8.1：配置 PWA

```bash
pnpm add next-pwa
```

**更新 `next.config.js`：**

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // 其他配置
});
```

**创建 `app/manifest.ts`：**

```typescript
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '宠灵感 PetSoul',
    short_name: '宠灵感',
    description: '让每张宠物照片都有内心戏',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6366f1',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
```

### 步骤 8.2：添加 Loading 状态

**创建 `app/loading.tsx`：**

```typescript
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
```

### 步骤 8.3：错误处理页面

**创建 `app/error.tsx`：**

```typescript
'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-semibold mb-4">出错了</h2>
      <p className="text-gray-500 mb-6">页面加载出现问题</p>
      <Button onClick={reset}>重试</Button>
    </div>
  );
}
```

### 步骤 8.4：添加环境变量

**创建 `.env.local`：**

```env
ANTHROPIC_API_KEY=sk-ant-xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**✅ 检查点：** 运行 `pnpm build` 确保无错误

---

## 完整页面路由

| 路由 | 页面 | 功能 |
| --- | --- | --- |
| `/` | 首页 | 图片上传入口 |
| `/generate` | 生成页 | 人设选择 + 生成 |
| `/result` | 结果页 | 内心戏展示 + 滑动选择 |
| `/meme` | 梗图页 | 编辑器 + 导出 |

---

## 检查清单

### MVP 功能完成度

- [ ] **FR.1.1** 照片上传（相册 + 拍照）
- [ ] **FR.1.2** AI 图像识别
- [ ] **FR.1.3** 生成 3 个内心独白
- [ ] **FR.1.4** 滑动切换版本
- [ ] **FR.2.1** 6 种基础人设
- [ ] **FR.2.2** 人设选择器
- [ ] **FR.3.1** 梗图生成
- [ ] **FR.3.4** 水印
- [ ] **FR.4.1** 分享功能
- [ ] **FR.4.2** 保存图片

### 技术验收

- [ ] 图片压缩正常（< 1MB）
- [ ] HEIC 格式支持
- [ ] API 响应 < 5s
- [ ] 错误提示友好
- [ ] PWA 可安装
- [ ] 移动端适配正常
