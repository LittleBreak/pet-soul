import '@testing-library/jest-dom/vitest'

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
