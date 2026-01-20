import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock ResizeObserver for Radix UI components
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock

// Mock PointerEvent for Radix UI Slider
class PointerEventMock extends MouseEvent {
  pointerId: number
  pointerType: string

  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props)
    this.pointerId = props.pointerId ?? 0
    this.pointerType = props.pointerType ?? 'mouse'
  }
}

global.PointerEvent = PointerEventMock as unknown as typeof PointerEvent

// Mock HTMLElement methods for Radix UI
Element.prototype.scrollIntoView = () => {}
Element.prototype.hasPointerCapture = () => false
Element.prototype.setPointerCapture = () => {}
Element.prototype.releasePointerCapture = () => {}

// Mock Swiper for ResultCarousel
vi.mock('swiper/react', () => ({
  Swiper: ({ children, onSwiper, initialSlide, className }: {
    children: React.ReactNode
    onSwiper?: (swiper: unknown) => void
    initialSlide?: number
    className?: string
  }) => {
    // Simulate swiper initialization
    if (onSwiper) {
      const mockSwiper = {
        activeIndex: initialSlide ?? 0,
        slideTo: vi.fn(),
      }
      setTimeout(() => onSwiper(mockSwiper), 0)
    }
    return <div data-testid="swiper" className={className}>{children}</div>
  },
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}))
vi.mock('swiper/modules', () => ({ Pagination: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/pagination', () => ({}))

// Mock react-dropzone for PhotoUploader
vi.mock('react-dropzone', () => ({
  useDropzone: ({ onDrop, onDragEnter, onDragLeave }: {
    onDrop?: (files: File[]) => void
    onDragEnter?: () => void
    onDragLeave?: () => void
  }) => ({
    getRootProps: () => ({
      onClick: () => {
        // Simulate file selection
      },
      onDragEnter,
      onDragLeave,
      'data-testid': 'dropzone',
    }),
    getInputProps: () => ({
      type: 'file',
      'data-testid': 'file-input',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0 && onDrop) {
          onDrop(Array.from(files))
        }
      },
    }),
  }),
}))

// Mock browser-image-compression for PhotoUploader
vi.mock('browser-image-compression', () => ({
  default: vi.fn((file: File) => Promise.resolve(file)),
}))

// Mock heic2any for PhotoUploader
vi.mock('heic2any', () => ({
  default: vi.fn((options: { blob: Blob }) => Promise.resolve(options.blob)),
}))

// Mock react-konva for MemeEditor
vi.mock('react-konva', () => ({
  Stage: ({ children, width, height }: {
    children: React.ReactNode
    width: number
    height: number
  }) => (
    <div data-testid="konva-stage" style={{ width, height }}>
      {children}
    </div>
  ),
  Layer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="konva-layer">{children}</div>
  ),
  Image: ({ width, height }: { width: number; height: number }) => (
    <div data-testid="konva-image" style={{ width, height }} />
  ),
  Text: ({ text, draggable }: { text: string; draggable?: boolean }) => (
    <div data-testid="konva-text" data-draggable={draggable}>
      {text}
    </div>
  ),
}))

// Mock framer-motion for MemeEditor
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}))

// Mock next/dynamic for MemeEditor
vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<{ default: React.ComponentType }>) => {
    // Return a simple component that renders children
    const DynamicComponent = (props: Record<string, unknown>) => {
      const Component = vi.fn(() => <div data-testid="dynamic-component" {...props} />)
      return <Component {...props} />
    }
    return DynamicComponent
  },
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve('')),
  },
})

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

// Mock Image constructor for image loading tests
class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  src = ''
  naturalWidth = 800
  naturalHeight = 600
  crossOrigin = ''
  _listeners: Record<string, (() => void)[]> = {}

  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload()
      // Also trigger load event listeners
      if (this._listeners['load']) {
        this._listeners['load'].forEach(cb => cb())
      }
    }, 0)
  }

  addEventListener(event: string, callback: () => void) {
    if (!this._listeners[event]) {
      this._listeners[event] = []
    }
    this._listeners[event].push(callback)
  }

  removeEventListener(event: string, callback: () => void) {
    if (this._listeners[event]) {
      this._listeners[event] = this._listeners[event].filter(cb => cb !== callback)
    }
  }
}

global.Image = MockImage as unknown as typeof Image

// Also mock HTMLImageElement for Radix Avatar
Object.defineProperty(window, 'HTMLImageElement', {
  writable: true,
  value: MockImage,
})
