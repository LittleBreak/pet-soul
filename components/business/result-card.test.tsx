import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ResultCard } from './result-card'
import type { Monologue } from '@/types'

const mockResult: Monologue = {
  id: 'result-1',
  content: '哼，这就是你今天的工作表现？勉强及格。',
  personaId: 'aloof-boss',
  tone: '高冷',
}

describe('ResultCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders monologue content', () => {
    render(<ResultCard result={mockResult} />)

    expect(screen.getByText('哼，这就是你今天的工作表现？勉强及格。')).toBeInTheDocument()
  })

  it('renders tone badge', () => {
    render(<ResultCard result={mockResult} />)

    expect(screen.getByText('高冷')).toBeInTheDocument()
  })

  it('applies selected state styling', () => {
    render(<ResultCard result={mockResult} selected />)

    const card = document.querySelector('[data-slot="result-card"]')
    expect(card).toHaveAttribute('data-selected', 'true')
  })

  it('shows check indicator when selected', () => {
    render(<ResultCard result={mockResult} selected />)

    // Check indicator should be visible
    const checkIndicator = document.querySelector('[data-slot="result-card"] .bg-primary.rounded-full')
    expect(checkIndicator).toBeInTheDocument()
  })

  it('does not show check indicator when not selected', () => {
    render(<ResultCard result={mockResult} />)

    const checkIndicator = document.querySelector('[data-slot="result-card"] .bg-primary.rounded-full')
    expect(checkIndicator).not.toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const handleSelect = vi.fn()
    render(<ResultCard result={mockResult} onSelect={handleSelect} />)

    const card = document.querySelector('[data-slot="result-card"]')
    await userEvent.click(card!)
    expect(handleSelect).toHaveBeenCalledOnce()
  })

  it('copies text to clipboard when copy button is clicked', async () => {
    render(<ResultCard result={mockResult} />)

    const copyButton = screen.getByRole('button', { name: /copy text/i })
    await userEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockResult.content)
  })

  it('shows copied state after copying', async () => {
    render(<ResultCard result={mockResult} />)

    const copyButton = screen.getByRole('button', { name: /copy text/i })
    await userEvent.click(copyButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
    })
  })

  it('copy button click does not trigger onSelect', async () => {
    const handleSelect = vi.fn()
    render(<ResultCard result={mockResult} onSelect={handleSelect} />)

    const copyButton = screen.getByRole('button', { name: /copy text/i })
    await userEvent.click(copyButton)

    expect(handleSelect).not.toHaveBeenCalled()
  })

  it('is not clickable without onSelect', () => {
    render(<ResultCard result={mockResult} />)

    const card = document.querySelector('[data-slot="result-card"]')
    expect(card).not.toHaveClass('cursor-pointer')
  })

  it('is clickable with onSelect', () => {
    const handleSelect = vi.fn()
    render(<ResultCard result={mockResult} onSelect={handleSelect} />)

    const card = document.querySelector('[data-slot="result-card"]')
    expect(card).toHaveClass('cursor-pointer')
  })

  it('applies custom className', () => {
    render(<ResultCard result={mockResult} className="custom-class" />)

    const card = document.querySelector('[data-slot="result-card"]')
    expect(card).toHaveClass('custom-class')
  })

  it('has data-slot attribute', () => {
    render(<ResultCard result={mockResult} />)

    const card = document.querySelector('[data-slot="result-card"]')
    expect(card).toBeInTheDocument()
  })

  it('handles clipboard error gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('Clipboard error'))

    render(<ResultCard result={mockResult} />)

    const copyButton = screen.getByRole('button', { name: /copy text/i })
    await userEvent.click(copyButton)

    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
