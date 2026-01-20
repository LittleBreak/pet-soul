import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemeEditor } from './meme-editor'

// Mock the dynamic imports
vi.mock('next/dynamic', () => ({
  default: (importFn: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>, options?: { ssr?: boolean }) => {
    // Return a simple component that renders children
    return function DynamicComponent(props: Record<string, unknown> & { children?: React.ReactNode }) {
      const { children, ...rest } = props
      return <div data-testid="dynamic-component" {...rest}>{children}</div>
    }
  },
}))

describe('MemeEditor', () => {
  const mockImageUrl = 'https://example.com/pet.jpg'
  const mockText = '哼，这就是你今天的工作表现？'
  const mockOnExport = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with data-slot attribute', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      const editor = document.querySelector('[data-slot="meme-editor"]')
      expect(editor).toBeInTheDocument()
    })
  })

  it('applies custom className', async () => {
    render(
      <MemeEditor
        imageUrl={mockImageUrl}
        text={mockText}
        className="custom-class"
      />
    )

    await waitFor(() => {
      const editor = document.querySelector('[data-slot="meme-editor"]')
      expect(editor).toHaveClass('custom-class')
    })
  })

  it('renders Font and Filter tab buttons', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /font/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /filter/i })).toBeInTheDocument()
    })
  })

  it('shows Font tab as selected by default', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      const fontTab = screen.getByRole('tab', { name: /font/i })
      expect(fontTab).toHaveAttribute('aria-selected', 'true')
    })
  })

  it('switches to Filter tab when clicked', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /filter/i })).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('tab', { name: /filter/i }))

    expect(screen.getByRole('tab', { name: /filter/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /font/i })).toHaveAttribute('aria-selected', 'false')
  })

  it('renders font style options in Font tab', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      expect(screen.getByText('Font Style')).toBeInTheDocument()
    })

    // Check for font family badges
    expect(screen.getByText('ZCOOL KuaiLe')).toBeInTheDocument()
  })

  it('renders font size slider in Font tab', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      expect(screen.getByText(/Font Size:/)).toBeInTheDocument()
    })

    // Slider should be present
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('renders color selection in Font tab', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      expect(screen.getByText('Text Color')).toBeInTheDocument()
    })

    // Color buttons should be present
    const colorButtons = screen.getAllByRole('button', { name: /select color/i })
    expect(colorButtons.length).toBeGreaterThanOrEqual(1)
  })

  it('renders filter options in Filter tab', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await userEvent.click(screen.getByRole('tab', { name: /filter/i }))

    await waitFor(() => {
      expect(screen.getByText('Image Filter')).toBeInTheDocument()
    })

    // Check for filter badges
    expect(screen.getByText('原图')).toBeInTheDocument()
    expect(screen.getByText('复古')).toBeInTheDocument()
    expect(screen.getByText('黑白')).toBeInTheDocument()
  })

  it('changes selected font when clicking font badge', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      expect(screen.getByText('思源黑体')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('思源黑体'))

    // The badge should now have the default variant (selected) - has bg-primary class
    const badge = screen.getByText('思源黑体').closest('[data-slot="badge"]')
    expect(badge).toHaveClass('bg-primary')
  })

  it('changes selected filter when clicking filter badge', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await userEvent.click(screen.getByRole('tab', { name: /filter/i }))

    await waitFor(() => {
      expect(screen.getByText('复古')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('复古'))

    const badge = screen.getByText('复古').closest('[data-slot="badge"]')
    expect(badge).toHaveClass('bg-primary')
  })

  it('renders Export button when onExport is provided', async () => {
    render(
      <MemeEditor
        imageUrl={mockImageUrl}
        text={mockText}
        onExport={mockOnExport}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /export meme/i })).toBeInTheDocument()
    })
  })

  it('does not render Export button when onExport is not provided', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /export meme/i })).not.toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    // Should show loading spinner initially
    const loadingSpinner = document.querySelector('.animate-spin')
    expect(loadingSpinner).toBeInTheDocument()
  })

  it('has accessible tab controls', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('aria-label', 'Meme editor options')
    })
  })

  it('tabs control their respective panels', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      const fontTab = screen.getByRole('tab', { name: /font/i })
      expect(fontTab).toHaveAttribute('aria-controls', 'font-panel')
    })

    const filterTab = screen.getByRole('tab', { name: /filter/i })
    expect(filterTab).toHaveAttribute('aria-controls', 'filter-panel')
  })

  it('renders tabpanel with correct aria-label', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await waitFor(() => {
      const panel = screen.getByRole('tabpanel')
      expect(panel).toHaveAttribute('aria-label', 'Font settings')
    })
  })

  it('changes tabpanel when switching tabs', async () => {
    render(<MemeEditor imageUrl={mockImageUrl} text={mockText} />)

    await userEvent.click(screen.getByRole('tab', { name: /filter/i }))

    await waitFor(() => {
      const panel = screen.getByRole('tabpanel')
      expect(panel).toHaveAttribute('aria-label', 'Filter settings')
    })
  })
})
