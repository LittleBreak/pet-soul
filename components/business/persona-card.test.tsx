import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PersonaCard } from './persona-card'
import type { Persona } from '@/types'

const mockPersona: Persona = {
  id: 'aloof-boss',
  name: '高冷总裁',
  description: '气场两米八，一切尽在掌握',
  icon: '👔',
  promptTemplate: 'test prompt',
  exampleQuotes: ['quote 1', 'quote 2'],
  styleTags: ['高冷', '霸道', '傲娇'],
  isPremium: false,
}

const mockPremiumPersona: Persona = {
  ...mockPersona,
  id: 'premium-persona' as Persona['id'],
  name: '甄嬛体',
  isPremium: true,
}

describe('PersonaCard', () => {
  it('renders persona name and description', () => {
    render(<PersonaCard persona={mockPersona} />)

    expect(screen.getByText('高冷总裁')).toBeInTheDocument()
    expect(screen.getByText('气场两米八，一切尽在掌握')).toBeInTheDocument()
  })

  it('renders persona icon with aria-label', () => {
    render(<PersonaCard persona={mockPersona} />)

    const icon = screen.getByRole('img', { name: '高冷总裁' })
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveTextContent('👔')
  })

  it('renders style tags as badges', () => {
    render(<PersonaCard persona={mockPersona} />)

    expect(screen.getByText('高冷')).toBeInTheDocument()
    expect(screen.getByText('霸道')).toBeInTheDocument()
    expect(screen.getByText('傲娇')).toBeInTheDocument()
  })

  it('renders Premium badge when isPremium is true', () => {
    render(<PersonaCard persona={mockPremiumPersona} />)

    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('does not render Premium badge for non-premium persona', () => {
    render(<PersonaCard persona={mockPersona} />)

    expect(screen.queryByText('Premium')).not.toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const handleSelect = vi.fn()
    render(<PersonaCard persona={mockPersona} onSelect={handleSelect} />)

    await userEvent.click(screen.getByRole('option'))
    expect(handleSelect).toHaveBeenCalledOnce()
  })

  it('calls onSelect when Enter key is pressed', async () => {
    const handleSelect = vi.fn()
    render(<PersonaCard persona={mockPersona} onSelect={handleSelect} />)

    const card = screen.getByRole('option')
    card.focus()
    await userEvent.keyboard('{Enter}')
    expect(handleSelect).toHaveBeenCalledOnce()
  })

  it('calls onSelect when Space key is pressed', async () => {
    const handleSelect = vi.fn()
    render(<PersonaCard persona={mockPersona} onSelect={handleSelect} />)

    const card = screen.getByRole('option')
    card.focus()
    await userEvent.keyboard(' ')
    expect(handleSelect).toHaveBeenCalledOnce()
  })

  it('applies selected state styling', () => {
    render(<PersonaCard persona={mockPersona} selected />)

    const card = document.querySelector('[data-slot="persona-card"]')
    expect(card).toHaveAttribute('data-selected', 'true')
    expect(card).toHaveClass('ring-2', 'ring-primary')
  })

  it('shows check indicator when selected', () => {
    render(<PersonaCard persona={mockPersona} selected />)

    // Check indicator should be visible (contains Check icon)
    const checkIndicator = document.querySelector('[data-slot="persona-card"] .bg-primary.rounded-full')
    expect(checkIndicator).toBeInTheDocument()
  })

  it('does not show check indicator when not selected', () => {
    render(<PersonaCard persona={mockPersona} />)

    const checkIndicator = document.querySelector('[data-slot="persona-card"] .bg-primary.rounded-full')
    expect(checkIndicator).not.toBeInTheDocument()
  })

  it('has role="option" and aria-selected when onSelect is provided', () => {
    const handleSelect = vi.fn()
    render(<PersonaCard persona={mockPersona} onSelect={handleSelect} selected />)

    const card = screen.getByRole('option')
    expect(card).toHaveAttribute('aria-selected', 'true')
  })

  it('is focusable when onSelect is provided', () => {
    const handleSelect = vi.fn()
    render(<PersonaCard persona={mockPersona} onSelect={handleSelect} />)

    const card = screen.getByRole('option')
    expect(card).toHaveAttribute('tabIndex', '0')
  })

  it('is not clickable without onSelect', () => {
    render(<PersonaCard persona={mockPersona} />)

    const card = document.querySelector('[data-slot="persona-card"]')
    expect(card).not.toHaveAttribute('role', 'option')
    expect(card).not.toHaveClass('cursor-pointer')
  })

  it('applies custom className', () => {
    render(<PersonaCard persona={mockPersona} className="custom-class" />)

    const card = document.querySelector('[data-slot="persona-card"]')
    expect(card).toHaveClass('custom-class')
  })

  it('has data-slot attribute', () => {
    render(<PersonaCard persona={mockPersona} />)

    const card = document.querySelector('[data-slot="persona-card"]')
    expect(card).toBeInTheDocument()
  })
})
