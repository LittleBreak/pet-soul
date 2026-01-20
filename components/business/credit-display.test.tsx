import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CreditDisplay } from './credit-display'

describe('CreditDisplay', () => {
  describe('Inline variant', () => {
    it('renders remaining credits', () => {
      render(<CreditDisplay used={2} total={5} />)

      expect(screen.getByText('3/5')).toBeInTheDocument()
    })

    it('renders warning style when credits are low (1 remaining)', () => {
      render(<CreditDisplay used={4} total={5} />)

      // Warning badge should have error variant (bg-error class)
      const badge = screen.getByText('1/5').closest('[data-slot="badge"]')
      expect(badge).toHaveClass('bg-error/10')
    })

    it('renders warning style when credits are exhausted', () => {
      render(<CreditDisplay used={5} total={5} />)

      const badge = screen.getByText('0/5').closest('[data-slot="badge"]')
      expect(badge).toHaveClass('bg-error/10')
    })

    it('renders normal style when credits are sufficient', () => {
      render(<CreditDisplay used={2} total={5} />)

      const badge = screen.getByText('3/5').closest('[data-slot="badge"]')
      expect(badge).toHaveClass('bg-secondary')
    })

    it('renders Premium badge for premium users', () => {
      render(<CreditDisplay used={0} total={5} isPremium />)

      expect(screen.getByText('Premium')).toBeInTheDocument()
    })

    it('does not show credits for premium users', () => {
      render(<CreditDisplay used={2} total={5} isPremium />)

      expect(screen.queryByText('3/5')).not.toBeInTheDocument()
    })

    it('has data-slot attribute', () => {
      render(<CreditDisplay used={2} total={5} />)

      const display = document.querySelector('[data-slot="credit-display"]')
      expect(display).toBeInTheDocument()
    })

    it('has data-variant attribute for inline variant', () => {
      render(<CreditDisplay used={2} total={5} variant="inline" />)

      const display = document.querySelector('[data-slot="credit-display"]')
      expect(display).toHaveAttribute('data-variant', 'inline')
    })

    it('applies custom className', () => {
      render(<CreditDisplay used={2} total={5} className="custom-class" />)

      const display = document.querySelector('[data-slot="credit-display"]')
      expect(display).toHaveClass('custom-class')
    })
  })

  describe('Detailed variant', () => {
    it('renders with progress bar', () => {
      render(<CreditDisplay used={2} total={5} variant="detailed" />)

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('renders progress bar with correct aria attributes', () => {
      render(<CreditDisplay used={2} total={5} variant="detailed" />)

      const progressbar = screen.getByRole('progressbar')
      expect(progressbar).toHaveAttribute('aria-valuenow', '2')
      expect(progressbar).toHaveAttribute('aria-valuemin', '0')
      expect(progressbar).toHaveAttribute('aria-valuemax', '5')
    })

    it('renders remaining text', () => {
      render(<CreditDisplay used={2} total={5} variant="detailed" />)

      expect(screen.getByText('3 / 5 remaining')).toBeInTheDocument()
    })

    it('renders "Daily Credits" label', () => {
      render(<CreditDisplay used={2} total={5} variant="detailed" />)

      expect(screen.getByText('Daily Credits')).toBeInTheDocument()
    })

    it('renders warning message when credits are low', () => {
      render(<CreditDisplay used={4} total={5} variant="detailed" />)

      expect(screen.getByText('Low credits remaining!')).toBeInTheDocument()
    })

    it('renders exhausted message when no credits remain', () => {
      render(<CreditDisplay used={5} total={5} variant="detailed" />)

      expect(screen.getByText('No credits left. Reset tomorrow.')).toBeInTheDocument()
    })

    it('does not render warning message when credits are sufficient', () => {
      render(<CreditDisplay used={2} total={5} variant="detailed" />)

      expect(screen.queryByText('Low credits remaining!')).not.toBeInTheDocument()
      expect(screen.queryByText('No credits left. Reset tomorrow.')).not.toBeInTheDocument()
    })

    it('renders "Unlimited" badge for premium users', () => {
      render(<CreditDisplay used={0} total={5} isPremium variant="detailed" />)

      expect(screen.getByText('Unlimited')).toBeInTheDocument()
    })

    it('renders "Premium" label for premium users', () => {
      render(<CreditDisplay used={0} total={5} isPremium variant="detailed" />)

      expect(screen.getByText('Premium')).toBeInTheDocument()
    })

    it('does not render progress bar for premium users', () => {
      render(<CreditDisplay used={0} total={5} isPremium variant="detailed" />)

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    it('has data-variant attribute for detailed variant', () => {
      render(<CreditDisplay used={2} total={5} variant="detailed" />)

      const display = document.querySelector('[data-slot="credit-display"]')
      expect(display).toHaveAttribute('data-variant', 'detailed')
    })
  })

  describe('Edge cases', () => {
    it('handles zero total credits', () => {
      render(<CreditDisplay used={0} total={0} />)

      expect(screen.getByText('0/0')).toBeInTheDocument()
    })

    it('handles used greater than total', () => {
      render(<CreditDisplay used={10} total={5} variant="detailed" />)

      // Should cap at 100%
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('renders correctly with all credits remaining', () => {
      render(<CreditDisplay used={0} total={5} />)

      const badge = screen.getByText('5/5').closest('[data-slot="badge"]')
      expect(badge).toHaveClass('bg-secondary')
    })
  })
})
