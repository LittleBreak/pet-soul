import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import * as Icons from './icons'

describe('Icons', () => {
  describe('Navigation & UI Icons', () => {
    it('exports Menu icon', () => {
      expect(Icons.Menu).toBeDefined()
      const { container } = render(<Icons.Menu />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('exports X icon', () => {
      expect(Icons.X).toBeDefined()
      const { container } = render(<Icons.X />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('exports ChevronLeft icon', () => {
      expect(Icons.ChevronLeft).toBeDefined()
    })

    it('exports ChevronRight icon', () => {
      expect(Icons.ChevronRight).toBeDefined()
    })

    it('exports Home icon', () => {
      expect(Icons.Home).toBeDefined()
    })

    it('exports Settings icon', () => {
      expect(Icons.Settings).toBeDefined()
    })
  })

  describe('Action Icons', () => {
    it('exports Plus icon', () => {
      expect(Icons.Plus).toBeDefined()
    })

    it('exports Check icon', () => {
      expect(Icons.Check).toBeDefined()
    })

    it('exports Copy icon', () => {
      expect(Icons.Copy).toBeDefined()
    })

    it('exports Trash2 icon', () => {
      expect(Icons.Trash2).toBeDefined()
    })

    it('exports Edit icon', () => {
      expect(Icons.Edit).toBeDefined()
    })

    it('exports Save icon', () => {
      expect(Icons.Save).toBeDefined()
    })

    it('exports Undo icon', () => {
      expect(Icons.Undo).toBeDefined()
    })

    it('exports Redo icon', () => {
      expect(Icons.Redo).toBeDefined()
    })
  })

  describe('Media & Upload Icons', () => {
    it('exports Upload icon', () => {
      expect(Icons.Upload).toBeDefined()
    })

    it('exports Download icon', () => {
      expect(Icons.Download).toBeDefined()
    })

    it('exports Image icon', () => {
      expect(Icons.Image).toBeDefined()
    })

    it('exports ImagePlus icon', () => {
      expect(Icons.ImagePlus).toBeDefined()
    })

    it('exports Sparkles icon', () => {
      expect(Icons.Sparkles).toBeDefined()
    })
  })

  describe('Share & Social Icons', () => {
    it('exports Share icon', () => {
      expect(Icons.Share).toBeDefined()
    })

    it('exports Share2 icon', () => {
      expect(Icons.Share2).toBeDefined()
    })

    it('exports Link icon', () => {
      expect(Icons.Link).toBeDefined()
    })

    it('exports Send icon', () => {
      expect(Icons.Send).toBeDefined()
    })
  })

  describe('Status & Feedback Icons', () => {
    it('exports Loader2 icon', () => {
      expect(Icons.Loader2).toBeDefined()
    })

    it('exports AlertCircle icon', () => {
      expect(Icons.AlertCircle).toBeDefined()
    })

    it('exports CheckCircle icon', () => {
      expect(Icons.CheckCircle).toBeDefined()
    })

    it('exports XCircle icon', () => {
      expect(Icons.XCircle).toBeDefined()
    })

    it('exports HelpCircle icon', () => {
      expect(Icons.HelpCircle).toBeDefined()
    })
  })

  describe('Pet & Persona Icons', () => {
    it('exports Cat icon', () => {
      expect(Icons.Cat).toBeDefined()
    })

    it('exports Dog icon', () => {
      expect(Icons.Dog).toBeDefined()
    })

    it('exports Heart icon', () => {
      expect(Icons.Heart).toBeDefined()
    })

    it('exports Star icon', () => {
      expect(Icons.Star).toBeDefined()
    })

    it('exports Crown icon', () => {
      expect(Icons.Crown).toBeDefined()
    })

    it('exports Zap icon', () => {
      expect(Icons.Zap).toBeDefined()
    })
  })

  describe('Meme Editor Icons', () => {
    it('exports Type icon', () => {
      expect(Icons.Type).toBeDefined()
    })

    it('exports Bold icon', () => {
      expect(Icons.Bold).toBeDefined()
    })

    it('exports Palette icon', () => {
      expect(Icons.Palette).toBeDefined()
    })

    it('exports Wand2 icon', () => {
      expect(Icons.Wand2).toBeDefined()
    })

    it('exports Move icon', () => {
      expect(Icons.Move).toBeDefined()
    })
  })

  describe('Misc Icons', () => {
    it('exports Search icon', () => {
      expect(Icons.Search).toBeDefined()
    })

    it('exports Eye icon', () => {
      expect(Icons.Eye).toBeDefined()
    })

    it('exports Lock icon', () => {
      expect(Icons.Lock).toBeDefined()
    })

    it('exports CreditCard icon', () => {
      expect(Icons.CreditCard).toBeDefined()
    })
  })

  describe('Icon props', () => {
    it('passes className prop to icon', () => {
      const { container } = render(<Icons.Check className="custom-class" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
    })

    it('passes size prop to icon', () => {
      const { container } = render(<Icons.Check size={32} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '32')
      expect(svg).toHaveAttribute('height', '32')
    })

    it('passes color prop to icon', () => {
      const { container } = render(<Icons.Check color="red" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('stroke', 'red')
    })

    it('passes strokeWidth prop to icon', () => {
      const { container } = render(<Icons.Check strokeWidth={3} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('stroke-width', '3')
    })
  })

  describe('Type exports', () => {
    it('exports LucideIcon type', () => {
      // Type check - if this compiles, the type is exported
      const icon: Icons.LucideIcon = Icons.Check
      expect(icon).toBeDefined()
    })

    it('exports LucideProps type', () => {
      // Type check - if this compiles, the type is exported
      const props: Icons.LucideProps = { size: 24, className: 'test' }
      expect(props).toBeDefined()
    })
  })
})
