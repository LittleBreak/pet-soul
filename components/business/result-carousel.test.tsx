import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ResultCarousel } from './result-carousel'
import type { Monologue } from '@/types'

const mockResults: Monologue[] = [
  {
    id: 'result-1',
    content: '哼，这就是你今天的工作表现？',
    personaId: 'aloof-boss',
    tone: '高冷',
  },
  {
    id: 'result-2',
    content: '本喵的晚餐呢？',
    personaId: 'aloof-boss',
    tone: '傲娇',
  },
  {
    id: 'result-3',
    content: '允许你摸我一下。',
    personaId: 'aloof-boss',
    tone: '霸道',
  },
]

describe('ResultCarousel', () => {
  it('renders all result cards', () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={mockResults}
        currentIndex={0}
        onSelectResult={handleSelect}
      />
    )

    expect(screen.getByText('哼，这就是你今天的工作表现？')).toBeInTheDocument()
    expect(screen.getByText('本喵的晚餐呢？')).toBeInTheDocument()
    expect(screen.getByText('允许你摸我一下。')).toBeInTheDocument()
  })

  it('renders swiper container', () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={mockResults}
        currentIndex={0}
        onSelectResult={handleSelect}
      />
    )

    expect(screen.getByTestId('swiper')).toBeInTheDocument()
  })

  it('renders swiper slides for each result', () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={mockResults}
        currentIndex={0}
        onSelectResult={handleSelect}
      />
    )

    const slides = screen.getAllByTestId('swiper-slide')
    expect(slides).toHaveLength(3)
  })

  it('renders pagination indicators', () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={mockResults}
        currentIndex={0}
        onSelectResult={handleSelect}
      />
    )

    const indicators = screen.getAllByRole('button', { name: /go to result/i })
    expect(indicators).toHaveLength(3)
  })

  it('calls onSelectResult when pagination indicator is clicked', async () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={mockResults}
        currentIndex={0}
        onSelectResult={handleSelect}
      />
    )

    const indicators = screen.getAllByRole('button', { name: /go to result/i })
    await userEvent.click(indicators[1])
    expect(handleSelect).toHaveBeenCalledWith(1)
  })

  it('highlights current index indicator', () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={mockResults}
        currentIndex={1}
        onSelectResult={handleSelect}
      />
    )

    const indicators = screen.getAllByRole('button', { name: /go to result/i })
    expect(indicators[1]).toHaveClass('bg-primary')
  })

  it('calls onSelectResult when result card is clicked', async () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={mockResults}
        currentIndex={0}
        onSelectResult={handleSelect}
      />
    )

    // Click on the second result card
    const cards = document.querySelectorAll('[data-slot="result-card"]')
    await userEvent.click(cards[1])
    expect(handleSelect).toHaveBeenCalledWith(1)
  })

  it('passes selected state to current index card', () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={mockResults}
        currentIndex={1}
        onSelectResult={handleSelect}
      />
    )

    const cards = document.querySelectorAll('[data-slot="result-card"]')
    expect(cards[1]).toHaveAttribute('data-selected', 'true')
    expect(cards[0]).not.toHaveAttribute('data-selected', 'true')
  })

  it('has data-slot attribute', () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={mockResults}
        currentIndex={0}
        onSelectResult={handleSelect}
      />
    )

    const carousel = document.querySelector('[data-slot="result-carousel"]')
    expect(carousel).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={mockResults}
        currentIndex={0}
        onSelectResult={handleSelect}
        className="custom-class"
      />
    )

    const carousel = document.querySelector('[data-slot="result-carousel"]')
    expect(carousel).toHaveClass('custom-class')
  })

  it('renders correctly with single result', () => {
    const handleSelect = vi.fn()
    render(
      <ResultCarousel
        results={[mockResults[0]]}
        currentIndex={0}
        onSelectResult={handleSelect}
      />
    )

    const slides = screen.getAllByTestId('swiper-slide')
    expect(slides).toHaveLength(1)

    const indicators = screen.getAllByRole('button', { name: /go to result/i })
    expect(indicators).toHaveLength(1)
  })
})
