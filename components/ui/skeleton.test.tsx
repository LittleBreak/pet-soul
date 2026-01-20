import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders with data-slot attribute', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-slot', 'skeleton')
  })

  it('applies shimmer class by default', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('skeleton')
  })

  it('applies pulse animation when shimmer is false', () => {
    render(<Skeleton shimmer={false} data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse')
    expect(screen.getByTestId('skeleton')).not.toHaveClass('skeleton')
  })

  it('applies custom className', () => {
    render(<Skeleton className="h-10 w-full" data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('h-10', 'w-full')
  })

  it('renders with base styling', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('rounded-lg', 'bg-muted')
  })

  it('can be used for text placeholder', () => {
    render(<Skeleton className="h-4 w-48" data-testid="text-skeleton" />)
    expect(screen.getByTestId('text-skeleton')).toBeInTheDocument()
  })

  it('can be used for avatar placeholder', () => {
    render(<Skeleton className="h-12 w-12 rounded-full" data-testid="avatar-skeleton" />)
    expect(screen.getByTestId('avatar-skeleton')).toHaveClass('rounded-full')
  })
})
