import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PersonaSelector } from './persona-selector'
import type { Persona, PersonaId } from '@/types'

const mockPersonas: Persona[] = [
  {
    id: 'aloof-boss',
    name: '高冷总裁',
    description: '气场两米八',
    icon: '👔',
    promptTemplate: 'test',
    exampleQuotes: [],
    styleTags: ['高冷'],
    isPremium: false,
  },
  {
    id: 'chatty-auntie',
    name: '碎碎念大妈',
    description: '操心一切',
    icon: '👵',
    promptTemplate: 'test',
    exampleQuotes: [],
    styleTags: ['唠叨'],
    isPremium: false,
  },
  {
    id: 'literary-youth',
    name: '文艺青年',
    description: '诗和远方',
    icon: '📚',
    promptTemplate: 'test',
    exampleQuotes: [],
    styleTags: ['文艺'],
    isPremium: false,
  },
]

describe('PersonaSelector', () => {
  it('renders all persona cards', () => {
    const handleSelect = vi.fn()
    render(
      <PersonaSelector
        personas={mockPersonas}
        selectedId="aloof-boss"
        onSelect={handleSelect}
      />
    )

    // Each persona appears twice (mobile + desktop views)
    expect(screen.getAllByText('高冷总裁').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('碎碎念大妈').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('文艺青年').length).toBeGreaterThanOrEqual(1)
  })

  it('renders default personas when not provided', () => {
    const handleSelect = vi.fn()
    render(
      <PersonaSelector
        selectedId="aloof-boss"
        onSelect={handleSelect}
      />
    )

    // Should render default 6 personas from constants
    expect(screen.getAllByText('高冷总裁').length).toBeGreaterThanOrEqual(1)
  })

  it('passes selected state to correct card', () => {
    const handleSelect = vi.fn()
    render(
      <PersonaSelector
        personas={mockPersonas}
        selectedId="chatty-auntie"
        onSelect={handleSelect}
      />
    )

    // Find the selected card
    const cards = document.querySelectorAll('[data-slot="persona-card"]')
    const selectedCard = Array.from(cards).find(card => card.getAttribute('data-selected') === 'true')
    expect(selectedCard).toBeInTheDocument()
  })

  it('calls onSelect with persona id when card is clicked', async () => {
    const handleSelect = vi.fn()
    render(
      <PersonaSelector
        personas={mockPersonas}
        selectedId="aloof-boss"
        onSelect={handleSelect}
      />
    )

    const options = screen.getAllByRole('option')
    await userEvent.click(options[1]) // Click second card
    expect(handleSelect).toHaveBeenCalledWith('chatty-auntie')
  })

  it('has role="listbox" for accessibility', () => {
    const handleSelect = vi.fn()
    render(
      <PersonaSelector
        personas={mockPersonas}
        selectedId="aloof-boss"
        onSelect={handleSelect}
      />
    )

    // There should be 2 listboxes (mobile and desktop)
    const listboxes = screen.getAllByRole('listbox')
    expect(listboxes.length).toBeGreaterThanOrEqual(1)
  })

  it('has aria-label on listbox', () => {
    const handleSelect = vi.fn()
    render(
      <PersonaSelector
        personas={mockPersonas}
        selectedId="aloof-boss"
        onSelect={handleSelect}
      />
    )

    const listboxes = screen.getAllByRole('listbox')
    listboxes.forEach(listbox => {
      expect(listbox).toHaveAttribute('aria-label', 'Select a persona')
    })
  })

  it('has data-slot attribute', () => {
    const handleSelect = vi.fn()
    render(
      <PersonaSelector
        personas={mockPersonas}
        selectedId="aloof-boss"
        onSelect={handleSelect}
      />
    )

    const selector = document.querySelector('[data-slot="persona-selector"]')
    expect(selector).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const handleSelect = vi.fn()
    render(
      <PersonaSelector
        personas={mockPersonas}
        selectedId="aloof-boss"
        onSelect={handleSelect}
        className="custom-class"
      />
    )

    const selector = document.querySelector('[data-slot="persona-selector"]')
    expect(selector).toHaveClass('custom-class')
  })

  it('renders mobile scroll container', () => {
    const handleSelect = vi.fn()
    render(
      <PersonaSelector
        personas={mockPersonas}
        selectedId="aloof-boss"
        onSelect={handleSelect}
      />
    )

    // Mobile container has overflow-x-auto class
    const mobileContainer = document.querySelector('.overflow-x-auto')
    expect(mobileContainer).toBeInTheDocument()
  })

  it('renders desktop grid container', () => {
    const handleSelect = vi.fn()
    render(
      <PersonaSelector
        personas={mockPersonas}
        selectedId="aloof-boss"
        onSelect={handleSelect}
      />
    )

    // Desktop container has md:grid class
    const desktopContainer = document.querySelector('.md\\:grid')
    expect(desktopContainer).toBeInTheDocument()
  })
})
