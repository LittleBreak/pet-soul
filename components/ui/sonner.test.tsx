import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Toaster } from './sonner'

// Mock the sonner library
vi.mock('sonner', () => ({
  Toaster: ({ className, position, icons, toastOptions, ...props }: {
    className?: string
    position?: string
    icons?: Record<string, React.ReactNode>
    toastOptions?: Record<string, unknown>
  }) => (
    <div
      data-testid="sonner-toaster"
      data-classname={className}
      data-position={position}
      data-has-icons={icons ? 'true' : 'false'}
      data-has-options={toastOptions ? 'true' : 'false'}
      {...props}
    />
  ),
}))

describe('Toaster', () => {
  it('renders without crashing', () => {
    const { container } = render(<Toaster />)
    expect(container).toBeInTheDocument()
  })

  it('renders with toaster class', () => {
    render(<Toaster />)

    const toaster = document.querySelector('[data-testid="sonner-toaster"]')
    expect(toaster).toHaveAttribute('data-classname', 'toaster group')
  })

  it('renders with top-center position', () => {
    render(<Toaster />)

    const toaster = document.querySelector('[data-testid="sonner-toaster"]')
    expect(toaster).toHaveAttribute('data-position', 'top-center')
  })

  it('provides custom icons', () => {
    render(<Toaster />)

    const toaster = document.querySelector('[data-testid="sonner-toaster"]')
    expect(toaster).toHaveAttribute('data-has-icons', 'true')
  })

  it('provides custom toast options', () => {
    render(<Toaster />)

    const toaster = document.querySelector('[data-testid="sonner-toaster"]')
    expect(toaster).toHaveAttribute('data-has-options', 'true')
  })

  it('passes additional props to Sonner', () => {
    render(<Toaster data-custom="test" />)

    const toaster = document.querySelector('[data-testid="sonner-toaster"]')
    expect(toaster).toHaveAttribute('data-custom', 'test')
  })
})
