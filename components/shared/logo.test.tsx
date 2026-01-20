import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Logo, LogoIcon } from './logo'

describe('Logo', () => {
  it('renders with default size', () => {
    render(<Logo />)

    expect(screen.getByLabelText('PetSoul')).toBeInTheDocument()
  })

  it('renders both icon and text by default', () => {
    render(<Logo />)

    // Text should be present
    expect(screen.getByText('Pet')).toBeInTheDocument()
    expect(screen.getByText('Soul')).toBeInTheDocument()

    // SVG icon should be present
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders only icon when iconOnly is true', () => {
    render(<Logo iconOnly />)

    // SVG should be present
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()

    // Text should not be present
    expect(screen.queryByText('Pet')).not.toBeInTheDocument()
    expect(screen.queryByText('Soul')).not.toBeInTheDocument()
  })

  it('renders without icon when showIcon is false', () => {
    render(<Logo showIcon={false} />)

    // Text should be present
    expect(screen.getByText('Pet')).toBeInTheDocument()
    expect(screen.getByText('Soul')).toBeInTheDocument()

    // SVG should not be present
    const svg = document.querySelector('svg')
    expect(svg).not.toBeInTheDocument()
  })

  it('renders without text when showText is false', () => {
    render(<Logo showText={false} />)

    // SVG should be present
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()

    // Text should not be present
    expect(screen.queryByText('Pet')).not.toBeInTheDocument()
    expect(screen.queryByText('Soul')).not.toBeInTheDocument()
  })

  it('applies small size', () => {
    render(<Logo size="sm" />)

    const container = screen.getByLabelText('PetSoul')
    expect(container).toHaveClass('text-lg')
  })

  it('applies large size', () => {
    render(<Logo size="lg" />)

    const container = screen.getByLabelText('PetSoul')
    expect(container).toHaveClass('text-2xl')
  })

  it('applies extra large size', () => {
    render(<Logo size="xl" />)

    const container = screen.getByLabelText('PetSoul')
    expect(container).toHaveClass('text-3xl')
  })

  it('applies custom className', () => {
    render(<Logo className="custom-class" />)

    const container = screen.getByLabelText('PetSoul')
    expect(container).toHaveClass('custom-class')
  })

  it('has aria-label for accessibility', () => {
    render(<Logo />)

    expect(screen.getByLabelText('PetSoul')).toBeInTheDocument()
  })
})

describe('LogoIcon', () => {
  it('renders SVG element', () => {
    render(<LogoIcon />)

    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('is hidden from assistive technology', () => {
    render(<LogoIcon />)

    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies custom className', () => {
    render(<LogoIcon className="custom-class" />)

    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
  })

  it('renders paw pad circles', () => {
    render(<LogoIcon />)

    const circles = document.querySelectorAll('circle')
    // Should have multiple circles (main pad + toe pads + highlights)
    expect(circles.length).toBeGreaterThanOrEqual(4)
  })

  it('has correct viewBox', () => {
    render(<LogoIcon />)

    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '0 0 48 48')
  })
})
